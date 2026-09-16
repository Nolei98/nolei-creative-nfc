/**
 * ==============================================================================
 * NOLEI CREATIVE — CONFIGURAÇÃO CENTRALIZADA (CLOUD & MULTI-TENANT)
 * ==============================================================================
 * 
 * Para ativar a nuvem em tempo real:
 * 1. Crie um projeto gratuito em https://supabase.com
 * 2. Cole as duas chaves abaixo (obtidas em Project Settings > API)
 * 3. Se mantiver vazio, o Nolei Core roda em MODO DEMO OFFLINE (sem quebras!)
 */

window.NOLEI_CONFIG = {
  // Exemplo: 'https://seu-projeto.supabase.co'
  supabaseUrl: '',

  // Exemplo: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' (anon public key)
  supabaseKey: '',

  // Configurações padrão
  defaultOrg: 'botanico-bistro',
  autoSyncLocalAlerts: true,
  debug: true,
  version: '1.0.0'
};
