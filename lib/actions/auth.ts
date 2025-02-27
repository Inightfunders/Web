"use server";

import "server-only";
import { z } from "zod";
import { signInSchema, signUpSchema } from "../validations/authSchema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { nanoid } from "nanoid";
import { truncateSync } from "fs";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  const supabase = createClient();

  const { email, password, firstName, lastName, role, ref } = values;

  try {
    // Perform sign up without email verification
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
         
        },
      },
      
    });
    console.log("user" , data)
    if (signUpError) {
      return {
        error: signUpError.message,
      };
    }

    if (!data.user?.id) {
      return {
        error: "No user ID returned from sign up",
      };
    }

    // Create user profile
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      first_name: firstName || null,
      last_name: lastName,
      role,
      ref: ref,
      plaid_id: nanoid(30),
    });

    if (insertError) {
      return {
        error: insertError.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  console.log({ error });

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  revalidatePath("/");
  return { error: null };
};

export const signOut = async () => {
  const supabase = createClient();

  await supabase.auth.signOut();

  revalidatePath("/");
  const redirectPath =
    process.env.NODE_ENV === "production" ? "https://insightfunders.com/" : "/";
  // return redirect("https://insightfunders.com/")
  return redirect(redirectPath);
};

export const getUser = cache(async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  // console.log({ supabaseUser: user, supabase, error });
  if (!user) return null;

  const userInfo = await db.query.users.findFirst({
    columns: {
      role: true,
      first_name: true,
      last_name: true,
      plaid_id: true,
      dwolla_customer_id: true,
      dwolla_customer_url: true,
    },
    where: (table, { eq }) => eq(table.id, user?.id!),
  });

  // console.log({ userInfo });

  if (userInfo?.role === "startup") {
    const userStartUpData = await db.query.startups.findFirst({
      with: {
        startups_owners: {
          columns: {
            name: true,
            share: true,
            id: true,
          },
        },
      },
      where: (table, { eq }) => eq(table.user_id, user?.id!),
    });

    if (!userStartUpData) return { user, userInfo };

    const userStartUp = {
      ...userStartUpData,
      startups_owners: userStartUpData?.startups_owners.map((owner) => ({
        ...owner,
        share: parseInt(owner.share! ?? 0),
      })),
    };

    return {
      user,
      userInfo,
      userStartUp,
      userStartUpOwners: userStartUp?.startups_owners,
    };
  } else if (userInfo?.role === "investor") {
    const userInvestor = await db.query.investors.findFirst({
      where: (table, { eq }) => eq(table.user_id, user?.id!),
    });

    return { user, userInfo, userInvestor };
  } else if (userInfo?.role === "partner") {
    const userPartners = await db.query.partners.findFirst({
      where: (table, { eq }) => eq(table.user_id, user?.id!),
    });
    return { user, userInfo, userPartners };
  }
});

export const getReferredUsers = cache(async (id: string) => {
  const supabase = createClient();
  console.log("id",id);
  // Fetch users whose "ref" field matches the provided ID
  const referredUsers = await db.query.users.findMany({
    columns: {
      id: true,
      role: true,
      first_name: true,
      last_name: true,
      plaid_id: true,
      dwolla_customer_id: true,
      dwolla_customer_url: true,
      ref: true,  
    },
    where: (table, { eq }) => eq(table.ref, id),
  });

  const referredUserIds = referredUsers.map((user) => user.id);
 
  
  if (referredUserIds.length === 0) {
    return { referredUsers, referredStartups: [] }; // No referred users found
  }

  // Fetch startups where `user_id` matches any of the referred user IDs
  const referredStartups = await db.query.startups.findMany({
    where: (table, { inArray }) => inArray(table.user_id, referredUserIds),
  });

  const referredInvestors = await db.query.investors.findMany({
    where: (table, { inArray }) => inArray(table.user_id, referredUserIds),
  });
  const statuses = referredUsers.map((user) => {
    const isStartup = referredStartups.some(startup => startup.user_id === user.id && startup.accepted=== true);
    const isInvestor = referredInvestors.some(investor => investor.user_id === user.id && investor.accepted=== true);

    return {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      status: isStartup || isInvestor ? "Registered" : "Pending",
      company_name: referredStartups.find(startup => startup.user_id === user.id)?.company_name 
      || referredInvestors.find(investor => investor.user_id === user.id)?.company_name 
      || user.first_name
      || null,
    };
  });

  return { referredUsers, referredStartups, referredInvestors, statuses };
});


export const createBankAccount = async ({
  userId,
  bankId,    
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: {
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
  fundingSourceUrl: string;
  shareableId: string;
}) => {
  const supabase = createClient();

  const { error } = await supabase.from("bank_accounts").insert({
    user_id: userId,
    bank_id: bankId,
    account_id: accountId,
    access_token: accessToken,
    funding_source_url: fundingSourceUrl,
    shareable_id: shareableId,
  });

  if (error) console.error("error", error);

  revalidatePath("/");

  return {
    success: true,
  };
};
