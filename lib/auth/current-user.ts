import { createClient } from "@/lib/supabase/server";

export interface CurrentUserProfile {
  id: string;
  email: string;
  fullName: string;
  userType: "viaggiatore" | "partner";
  regionSlug: string | null;
  socialLink: string | null;
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, full_name, region_slug, social_link")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    userType: profile.user_type,
    regionSlug: profile.region_slug,
    socialLink: profile.social_link,
  };
}
