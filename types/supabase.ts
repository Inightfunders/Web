export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          access_token: string | null
          account_id: string | null
          bank_id: string | null
          funding_source_url: string | null
          id: number
          shareable_id: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          bank_id?: string | null
          funding_source_url?: string | null
          id?: number
          shareable_id?: string | null
          user_id?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          bank_id?: string | null
          funding_source_url?: string | null
          id?: number
          shareable_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cap_tables: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cap_tables_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          accepted: boolean
          amount_invested: number
          createdAt: string | null
          id: number
          interest_rate: number | null
          investment_amount_paid: boolean | null
          investor_id: number
          maturity_date: string | null
          payment_interval:
            | Database["public"]["Enums"]["payment_interval"]
            | null
          startup_id: number
          term_sheet: string | null
          total_return_paid: number | null
        }
        Insert: {
          accepted: boolean
          amount_invested: number
          createdAt?: string | null
          id?: number
          interest_rate?: number | null
          investment_amount_paid?: boolean | null
          investor_id: number
          maturity_date?: string | null
          payment_interval?:
            | Database["public"]["Enums"]["payment_interval"]
            | null
          startup_id: number
          term_sheet?: string | null
          total_return_paid?: number | null
        }
        Update: {
          accepted?: boolean
          amount_invested?: number
          createdAt?: string | null
          id?: number
          interest_rate?: number | null
          investment_amount_paid?: boolean | null
          investor_id?: number
          maturity_date?: string | null
          payment_interval?:
            | Database["public"]["Enums"]["payment_interval"]
            | null
          startup_id?: number
          term_sheet?: string | null
          total_return_paid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string | null
          id: number
          question: string
          tab: Database["public"]["Enums"]["faqs_tabs"] | null
        }
        Insert: {
          answer?: string | null
          id?: number
          question: string
          tab?: Database["public"]["Enums"]["faqs_tabs"] | null
        }
        Update: {
          answer?: string | null
          id?: number
          question?: string
          tab?: Database["public"]["Enums"]["faqs_tabs"] | null
        }
        Relationships: []
      }
      financial_details_requests: {
        Row: {
          accepted: boolean | null
          createdAt: string | null
          id: number
          investor_id: number | null
          startup_id: number
        }
        Insert: {
          accepted?: boolean | null
          createdAt?: string | null
          id?: number
          investor_id?: number | null
          startup_id: number
        }
        Update: {
          accepted?: boolean | null
          createdAt?: string | null
          id?: number
          investor_id?: number | null
          startup_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "financial_details_requests_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_details_requests_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_rounds: {
        Row: {
          amount: number | null
          date: string | null
          id: number
          investor: string[]
          round: Database["public"]["Enums"]["company_stage"] | null
          startup_id: number | null
        }
        Insert: {
          amount?: number | null
          date?: string | null
          id?: number
          investor: string[]
          round?: Database["public"]["Enums"]["company_stage"] | null
          startup_id?: number | null
        }
        Update: {
          amount?: number | null
          date?: string | null
          id?: number
          investor?: string[]
          round?: Database["public"]["Enums"]["company_stage"] | null
          startup_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_rounds_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statements: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_statements_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          accepted: boolean
          accreditation: string | null
          company_email: string | null
          company_name: string | null
          company_website: string | null
          created_at: string
          future_investment_amount:
            | Database["public"]["Enums"]["future_investment_amounts"]
            | null
          geographies_served:
            | Database["public"]["Enums"]["geographies_served"][]
            | null
          id: number
          institution_type:
            | Database["public"]["Enums"]["institution_types"]
            | null
          investor_type: Database["public"]["Enums"]["investor_type"] | null
          // legal_entity_type: Database["public"]["Enums"]["legal_entity_type"] | null
          max_facility_size:
            | Database["public"]["Enums"]["max_facility_size"]
            | null
          minimum_revenue_requirement:
            | Database["public"]["Enums"]["minimum_revenue_requirement"]
            | null
          products_offered:
            | Database["public"]["Enums"]["products_offered"][]
            | null
          submitted: boolean | null
          user_id: string
        }
        Insert: {
          accepted?: boolean
          accreditation?: string | null
          company_email?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          future_investment_amount?:
            | Database["public"]["Enums"]["future_investment_amounts"]
            | null
          geographies_served?:
            | Database["public"]["Enums"]["geographies_served"][]
            | null
          id?: number
          institution_type?:
            | Database["public"]["Enums"]["institution_types"]
            | null
          investor_type?: Database["public"]["Enums"]["investor_type"] | null
          // legal_entity_type: Database["public"]["Enums"]["legal_entity_type"] | null
          max_facility_size?:
          | Database["public"]["Enums"]["max_facility_size"]
          | null
          minimum_revenue_requirement?:
            | Database["public"]["Enums"]["minimum_revenue_requirement"]
            | null
          products_offered?:
            | Database["public"]["Enums"]["products_offered"][]
            | null
          submitted?: boolean | null
          user_id?: string
        }
        Update: {
          accepted?: boolean
          accreditation?: string | null
          company_email?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          future_investment_amount?:
          | Database["public"]["Enums"]["future_investment_amounts"]
          | null
          geographies_served?:
          | Database["public"]["Enums"]["geographies_served"][]
          | null
          id?: number
          institution_type?:
          | Database["public"]["Enums"]["institution_types"]
          | null
          // legal_entity_type: Database["public"]["Enums"]["legal_entity_type"] | null
          investor_type?: Database["public"]["Enums"]["investor_type"] | null
          max_facility_size?:
            | Database["public"]["Enums"]["max_facility_size"]
            | null
          minimum_revenue_requirement?:
            | Database["public"]["Enums"]["minimum_revenue_requirement"]
            | null
          products_offered?:
            | Database["public"]["Enums"]["products_offered"][]
            | null
          submitted?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          id: string
          user_id: string
          partner_name: string | null
          occupation: string | null
          company_name: string | null
        }
        Insert: {
          partner_name?: string | null
          occupation?: string | null
          company_name?: string | null
          user_id?: string
        }
        Update: {
          partner_name?: string | null
          occupation?: string | null
          company_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_documents: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          nda_status: boolean 
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          nda_status?: boolean 
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          nda_status?: boolean 
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      other_documents: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "other_documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_projection: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_projection_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_statements: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_statements_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      nda: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nda_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          id: number
          is_read: boolean | null
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          is_read?: boolean | null
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          is_read?: boolean | null
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          contract_id: number | null
          created_at: string
          due_date: string | null
          id: number
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount?: number | null
          contract_id?: number | null
          created_at?: string
          due_date?: string | null
          id?: number
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number | null
          contract_id?: number | null
          created_at?: string
          due_date?: string | null
          id?: number
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_decks: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pitch_decks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          accepted: boolean
          address: string | null
          business_structure:
            | Database["public"]["Enums"]["business_structure"]
            | null
          company_name: string | null
          created_at: string
          EIN: string | null
          email: string | null
          id: number
          industry_sector:
            | Database["public"]["Enums"]["industry_and_sector"]
            | null
          other_industry_and_sector: string | null
          phone_number: string | null
          recent_raise: number | null
          stage: Database["public"]["Enums"]["company_stage"] | null
          submitted: boolean
          user_id: string
        }
        Insert: {
          accepted?: boolean
          address?: string | null
          business_structure?:
            | Database["public"]["Enums"]["business_structure"]
            | null
          company_name?: string | null
          created_at?: string
          EIN?: string | null
          email?: string | null
          id?: number
          industry_sector?:
            | Database["public"]["Enums"]["industry_and_sector"]
            | null
          other_industry_and_sector?: string | null
          phone_number?: string | null
          recent_raise?: number | null
          stage?: Database["public"]["Enums"]["company_stage"] | null
          submitted?: boolean
          user_id?: string
        }
        Update: {
          accepted?: boolean
          address?: string | null
          business_structure?:
            | Database["public"]["Enums"]["business_structure"]
            | null
          company_name?: string | null
          created_at?: string
          EIN?: string | null
          email?: string | null
          id?: number
          industry_sector?:
            | Database["public"]["Enums"]["industry_and_sector"]
            | null
          other_industry_and_sector?: string | null
          phone_number?: string | null
          recent_raise?: number | null
          stage?: Database["public"]["Enums"]["company_stage"] | null
          submitted?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      startups_owners: {
        Row: {
          id: number
          name: string | null
          share: number | null
          startup_id: number
        }
        Insert: {
          id?: number
          name?: string | null
          share?: number | null
          startup_id: number
        }
        Update: {
          id?: number
          name?: string | null
          share?: number | null
          startup_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "startups_owners_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_returns: {
        Row: {
          created_at: string
          document_link: string | null
          id: number
          name: string | null
          startup_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_link?: string | null
          id?: number
          name?: string | null
          startup_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_returns_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_receiverId_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_senderId_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          dwolla_customer_id: string | null
          dwolla_customer_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          profile_img: string | null
          plaid_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          dwolla_customer_id?: string | null
          dwolla_customer_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_img?: string | null
          plaid_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          dwolla_customer_id?: string | null
          dwolla_customer_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_img?: string | null
          plaid_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_structure:
        | "Sole Proprietorship"
        | "Partnership"
        | "Corporation"
        | "S Corporation"
        | "Limited Liability Company"
      company_stage:
        | "Pre-seed"
        | "Seed"
        | "Series A"
        | "Series B"
        | "Series C"
        | "Series D"
        | "Series E"
        | "Series F"
        | "Public"
      faqs_tabs: "General Questions" | "For Startups" | "For Investors"
      future_investment_amounts:
        | "Less than $250K"
        | "$250K - $1M"
        | "S1M - $5M"
        | "$5M+"
        | "Not sure"
      geographies_served:
        | "United States"
        | "Canada"
        | "Mexico"
        | "United Kingdom"
        | "Other"
      industry_and_sector:
        | "Technology"
        | "Healthcare"
        | "Financial Services"
        | "Consumer Goods"
        | "Industrial Goods"
        | "Energy"
        | "Real Estate"
        | "Retail"
        | "Media and Entertainment"
        | "Transportation"
        | "Telecommunications"
        | "Agriculture"
        | "Education"
        | "Hospitality and Leisure"
        | "Utilities"
        | "Other"
      institution_types:
        | "Corporation"
        | "Family Office"
        | "Fund"
        | "Registered Investment Advisor (RIA)"
        | "Other"
      // legal_entity_type:
      //   | "Sole Proprietor / Single Member LLC"
      //   | "Corporation"
      //   | "Partnership"
      //   | "LLC (non-single member)"
      //   | "Trust/Estate"
      //   | "Other"
      investor_type: "Individual" | "Institution"
      max_facility_size:
        | "N/A"
        | "<$1M"
        | "$1-10M"
        | "$10-50M"
        | "$50-250M"
        | "$250M+"
      minimum_revenue_requirement:
        | "N/A"
        | "<$1M"
        | "$1-10M"
        | "$10-50M"
        | "$50-100M"
        | "$100M+"
      notification_type: "Contract" | "Request" | "Payment"
      payment_interval: "week" | "month" | "quarter" | "year"
      payment_status: "Paid" | "Due" | "Pending"
      products_offered:
        | "Venture Debt"
        | "Asset-Based Lending"
        | "Warehouse Lending"
        | "Invoice and Contract Factoring"
        | "Revenue-Based Financing"
        | "Equipment Leasing"
        | "M&A"
        | "Recapitalizations and Refinancing"
        | "Buyouts"
        | "Bridge Loans"
        | "Other"
      user_role: "startup" | "investor" | "partner";
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
