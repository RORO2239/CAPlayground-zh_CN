// 禁用的Supabase客户端 - 仅本地存储模式
const disabledClient: any = {
  _disabled: true,
  auth: {
    async getSession() {
      return { data: { session: null }, error: null }
    },
    onAuthStateChange(_cb: any) {
      return { data: { subscription: { unsubscribe() {} } } }
    },
    async signInWithPassword() {
      return { data: null, error: new Error("认证功能已禁用") }
    },
    async signUp() {
      return { data: null, error: new Error("认证功能已禁用") }
    },
    async signOut() {
      return { error: null }
    },
    async signInWithOAuth() {
      return { data: null, error: new Error("认证功能已禁用") }
    },
    async getUser() {
      return { data: { user: null }, error: null }
    },
  },
}

export function getSupabaseBrowserClient() {
  return disabledClient
}

export function getSupabaseAdminClient() {
  return disabledClient
}

export function getSupabaseServerClientWithAuth(_token: string) {
  return disabledClient
}

export const AUTH_ENABLED = false
