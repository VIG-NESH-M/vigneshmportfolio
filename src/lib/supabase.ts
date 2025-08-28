import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface PortfolioConfig {
  id: string;
  name: string;
  email: string;
  about_tagline: string;
  about_content: string;
  hero_title: string;
  hero_years_experience: string;
  hero_projects_completed: string;
  hero_technologies: string;
  created_at: string;
  updated_at: string;
}

export interface NavLink {
  id: string;
  href: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image_url?: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  date_range: string;
  role: string;
  company: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  title: string;
  href: string;
  icon_name?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// =============================================================================
// AUTHENTICATION FUNCTIONS
// =============================================================================

/**
 * Sign in admin user with email and password
 */
export async function signInAdmin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Verify the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      throw new Error("User is not authorized as admin");
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error("Admin sign in error:", error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.email) return false;

    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", session.user.email)
      .eq("is_active", true)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

// =============================================================================
// PUBLIC READ FUNCTIONS (Anyone can access)
// =============================================================================

/**
 * Fetch portfolio configuration
 */
export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  try {
    const { data, error } = await supabase
      .from("portfolio_config")
      .select("*")
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching portfolio config:", error);
    return null;
  }
}

/**
 * Fetch all active navigation links
 */
export async function getNavLinks(): Promise<NavLink[]> {
  try {
    const { data, error } = await supabase
      .from("nav_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching nav links:", error);
    return [];
  }
}

/**
 * Fetch all active skills
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

/**
 * Fetch all active projects
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/**
 * Fetch featured projects only
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

/**
 * Fetch all active experience entries
 */
export async function getExperience(): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

/**
 * Fetch all active social links
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
}

/**
 * Submit contact form message (public access)
 */
export async function submitContactMessage(
  name: string,
  email: string,
  subject: string | undefined,
  message: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return false;
  }
}

// =============================================================================
// ADMIN FUNCTIONS (Requires authentication)
// =============================================================================

/**
 * Get all contact messages (admin only)
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
}

/**
 * Mark contact message as read (admin only)
 */
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking message as read:", error);
    return false;
  }
}

/**
 * Create a new project (admin only)
 */
export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">
): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
}

/**
 * Update an existing project (admin only)
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
}

/**
 * Delete a project (admin only)
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

/**
 * Update portfolio configuration (admin only)
 */
export async function updatePortfolioConfig(
  updates: Partial<Omit<PortfolioConfig, "id" | "created_at" | "updated_at">>
): Promise<PortfolioConfig | null> {
  try {
    // First, get the current config to find the ID
    const currentConfig = await getPortfolioConfig();
    if (!currentConfig) {
      console.error("No portfolio config found to update");
      return null;
    }

    const { data, error } = await supabase
      .from("portfolio_config")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentConfig.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating portfolio config:", error);
    return null;
  }
}

/**
 * Create a new skill (admin only)
 */
export async function createSkill(
  skill: Omit<Skill, "id" | "created_at" | "updated_at">
): Promise<Skill | null> {
  try {
    const { data, error } = await supabase
      .from("skills")
      .insert(skill)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating skill:", error);
    return null;
  }
}

/**
 * Update an existing skill (admin only)
 */
export async function updateSkill(
  skillId: string,
  updates: Partial<Omit<Skill, "id" | "created_at" | "updated_at">>
): Promise<Skill | null> {
  try {
    const { data, error } = await supabase
      .from("skills")
      .update(updates)
      .eq("id", skillId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating skill:", error);
    return null;
  }
}

/**
 * Delete a skill (admin only)
 */
export async function deleteSkill(skillId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("skills").delete().eq("id", skillId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting skill:", error);
    return false;
  }
}

// =============================================================================
// ADMIN: NAV LINKS CRUD
// =============================================================================

export async function createNavLink(
  link: Omit<NavLink, "id" | "created_at" | "updated_at">
): Promise<NavLink | null> {
  try {
    const { data, error } = await supabase
      .from("nav_links")
      .insert(link)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating nav link:", error);
    return null;
  }
}

export async function updateNavLink(
  linkId: string,
  updates: Partial<Omit<NavLink, "id" | "created_at" | "updated_at">>
): Promise<NavLink | null> {
  try {
    const { data, error } = await supabase
      .from("nav_links")
      .update(updates)
      .eq("id", linkId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating nav link:", error);
    return null;
  }
}

export async function deleteNavLink(linkId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("nav_links")
      .delete()
      .eq("id", linkId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting nav link:", error);
    return false;
  }
}

// =============================================================================
// ADMIN: EXPERIENCE CRUD
// =============================================================================

export async function createExperience(
  exp: Omit<Experience, "id" | "created_at" | "updated_at">
): Promise<Experience | null> {
  try {
    const { data, error } = await supabase
      .from("experience")
      .insert(exp)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating experience:", error);
    return null;
  }
}

export async function updateExperience(
  experienceId: string,
  updates: Partial<Omit<Experience, "id" | "created_at" | "updated_at">>
): Promise<Experience | null> {
  try {
    const { data, error } = await supabase
      .from("experience")
      .update(updates)
      .eq("id", experienceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating experience:", error);
    return null;
  }
}

export async function deleteExperience(experienceId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", experienceId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting experience:", error);
    return false;
  }
}

// =============================================================================
// ADMIN: SOCIAL LINKS CRUD
// =============================================================================

export async function createSocialLink(
  social: Omit<SocialLink, "id" | "created_at" | "updated_at">
): Promise<SocialLink | null> {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .insert(social)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating social link:", error);
    return null;
  }
}

export async function updateSocialLink(
  socialId: string,
  updates: Partial<Omit<SocialLink, "id" | "created_at" | "updated_at">>
): Promise<SocialLink | null> {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .update(updates)
      .eq("id", socialId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating social link:", error);
    return null;
  }
}

export async function deleteSocialLink(socialId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", socialId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting social link:", error);
    return false;
  }
}

// =============================================================================
// REAL-TIME SUBSCRIPTIONS
// =============================================================================

/**
 * Subscribe to project changes
 */
export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const subscription = supabase
    .channel("projects-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "projects",
      },
      () => {
        // Refetch projects when changes occur
        getProjects().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

/**
 * Subscribe to contact messages (admin only)
 */
export function subscribeToContactMessages(
  callback: (messages: ContactMessage[]) => void
) {
  const subscription = supabase
    .channel("contact-messages-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "contact_messages",
      },
      () => {
        // Refetch messages when changes occur
        getContactMessages().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}
