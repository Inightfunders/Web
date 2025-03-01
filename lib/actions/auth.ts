'use server';

import 'server-only';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { signInSchema, signUpSchema } from '../validations/authSchema';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { db } from '@/db';
import { users } from "@/migrations/schema"
import { getAllReferredUsers } from './startup';
import { or, inArray } from "drizzle-orm";

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
        error: signUpError.message
      };
    }

    if (!data.user?.id) {
      return {
        error: 'No user ID returned from sign up'
      };
    }

    // Create user profile
    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      first_name: firstName || null,
      last_name: lastName,
      role,
      ref: ref,
      plaid_id: nanoid(30),
    });

    if (insertError) {
      return {
        error: insertError.message
      };
    }

    if (role === 'partner') {
      await upsertPartner({userId: data.user.id})
    }

    return {
      success: true
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password
  });

  if (error) {
    console.error({ error });
    return { error: { message: error.message, code: error.code } };
  }

  revalidatePath('/');
  return { error: null };
};

export const signOut = async () => {
  const supabase = createClient();

  await supabase.auth.signOut();

  revalidatePath('/');
  const redirectPath =
    process.env.NODE_ENV === 'production' ? 'https://insightfunders.com/' : '/';
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
      dwolla_customer_url: true
    },
    where: (table, { eq }) => eq(table.id, user?.id!)
  });

  // console.log({ userInfo });

  if (userInfo?.role === 'startup') {
    const userStartUpData = await db.query.startups.findFirst({
      with: {
        startups_owners: {
          columns: {
            name: true,
            share: true,
            id: true
          }
        }
      },
      where: (table, { eq }) => eq(table.user_id, user?.id!)
    });

    if (!userStartUpData) return { user, userInfo };

    const userStartUp = {
      ...userStartUpData,
      startups_owners: userStartUpData?.startups_owners.map((owner) => ({
        ...owner,
        share: parseInt(owner.share! ?? 0)
      }))
    };

    return {
      user,
      userInfo,
      userStartUp,
      userStartUpOwners: userStartUp?.startups_owners
    };
  } else if (userInfo?.role === 'investor') {
    const userInvestor = await db.query.investors.findFirst({
      where: (table, { eq }) => eq(table.user_id, user?.id!)
    });

    return { user, userInfo, userInvestor };
  } else if (userInfo?.role === 'partner') {
    const userPartners = await db.query.partners.findFirst({
      where: (table, { eq }) => eq(table.user_id, user?.id!)
    });
    return { user, userInfo, userPartners };
  }
});

export const getReferredUsers = cache(async (id: string) => {
  const supabase = createClient();
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
  // const refferuserData = await getAllReferredUsers()
  // console.log("allrefered", refferuserData)
  const referredUserIds = referredUsers.map((user) => user.id);


  if (referredUserIds.length === 0) {
    return { referredUsers, referredStartups: [] }; 
  }

  // Fetch startups where `user_id` matches any of the referred user IDs
  const referredStartups = referredUserIds.length ? await db.query.startups.findMany({
    where: (table, { inArray }) => inArray(table.user_id, referredUserIds),
  }):[];

  const referredInvestors = referredUserIds.length ? await db.query.investors.findMany({
    where: (table, { inArray }) => inArray(table.user_id, referredUserIds),
  }) :[];

  const referrederning = id 
  ? await db.query.referrals.findMany({
      where: (table, { eq }) => eq(table.referred_user_id, id), // Use eq() for a single UUID
    }) 
  : [];
  const referredInvestorIds = referredInvestors.map((investor) => investor.id);
  const referredStartupIds = referredStartups.map((startup) => startup.id);

  const referredContracts = referredInvestorIds.length || referredStartupIds.length
    ? await db.query.contracts.findMany({
        where: (table) =>
          or(
            referredInvestorIds.length > 0
              ? inArray(table.investor_id, referredInvestorIds)
              : undefined,
            referredStartupIds.length > 0
              ? inArray(table.startup_id, referredStartupIds)
              : undefined
          ), 
      })
    : [];
  //  console.log("reffer", referredContracts)
  //  console.log("reffererning", referrederning)
   const referredcombine = referredContracts.map((contact) => {
    const matchedStartup = referredStartups.find(startup => startup.id === contact.startup_id);
  
    return {
      id: matchedStartup ? matchedStartup.user_id : null, // Get the user_id from the matched startup
      investor_id: contact.investor_id,
      startup_id: contact.startup_id,
      amount_invested: Number(contact.amount_invested)*0.02*0.2,
      accepted: contact.accepted,
    };
  });
  const statuses = referredUsers.map((user) => {
    const isStartup = referredStartups.some(startup => startup.user_id === user.id && startup.accepted=== true);
    const isInvestor = referredInvestors.some(investor => investor.user_id === user.id && investor.accepted=== true);
    const isContracted = referredcombine.some(contract => contract.id === user.id );
    return {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      status: isStartup || isInvestor ? "Registered" : "Pending",
      company_name: referredStartups.find(startup => startup.user_id === user.id)?.company_name 
      || referredInvestors.find(investor => investor.user_id === user.id)?.company_name 
      || user.first_name
      || null,
      earnings: referredcombine.find(contract => contract.id === user.id)?.amount_invested  || 0,
      accepted:  referredcombine.find(contract => contract.id === user.id)?.accepted ,
    };
  });
  console.log("referred", referredcombine);
  console.log("status", statuses);
  return { referredUsers, referredStartups, referredInvestors, statuses };
});

export const createBankAccount = async ({
  userId,
  bankId,    
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId
}: {
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
  fundingSourceUrl: string;
  shareableId: string;
}) => {
  const supabase = createClient();

  const { error } = await supabase.from('bank_accounts').insert({
    user_id: userId,
    bank_id: bankId,
    account_id: accountId,
    access_token: accessToken,
    funding_source_url: fundingSourceUrl,
    shareable_id: shareableId
  });

  if (error) console.error('error', error);

  revalidatePath('/');

  return {
    success: true
  };
};

export const upsertPartner = async ({
  userId,
  occupation,
  companyName
}: {
  userId: string;
  occupation?: string;
  companyName?: string;
}) => {
  const supabase = createClient();

  const { error } = await supabase
    .from('partners')
    .upsert({ user_id: userId, occupation: occupation, company_name: companyName })
    .eq('user_id', userId);

  if (error) {
    console.error('error', error);
    return {
      success: false
    };
  }

  revalidatePath('/');

  return {
    success: true
  };
};
