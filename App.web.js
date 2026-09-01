import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from './lib/supabase';

const C = { bg: '#050505', card: '#111', gold: '#FFD400', white: '#fff', muted: '#888' };

export default function AppWeb() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await supabase.from('videos').select('id,caption,video_url,location_name,like_count,comment_count,profiles(username,display_name)').eq('status', 'published').eq('visibility', 'public').order('created_at', { ascending: false }).limit(20);
    if (!r.error) setVideos(r.data || []);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) await load();
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!mounted) return;
      setSession(next);
      if (next) await load();
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const signIn = async () => {
    setBusy(true); setError('');
    const r = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (r.error) setError(r.error.message);
    else await load();
    setBusy(false);
  };

  if (loading) return <View style={s.center}><ActivityIndicator color={C.gold} /><Text style={s.logo}>DZVibe</Text></View>;

  if (!session) return <View style={s.page}><View style={s.box}><Text style={s.logo}>DZVibe 🇩🇿</Text><Text style={s.subtitle}>نسخة Web للتجربة</Text><TextInput value={email} onChangeText={setEmail} placeholder="البريد الإلكتروني" placeholderTextColor="#777" style={s.input} autoCapitalize="none" keyboardType="email-address"/><TextInput value={password} onChangeText={setPassword} placeholder="كلمة المرور" placeholderTextColor="#777" style={s.input} secureTextEntry/><Pressable disabled={busy} onPress={signIn} style={s.button}><Text style={s.buttonText}>{busy ? 'جارٍ الدخول...' : 'تسجيل الدخول'}</Text></Pressable>{error ? <Text style={s.error}>{error}</Text> : null}</View></View>;

  return <View style={s.page}><View style={s.header}><Text style={s.logo}>DZVibe 🇩🇿</Text><Pressable onPress={() => supabase.auth.signOut()}><Text style={s.logout}>خروج</Text></Pressable></View><ScrollView contentContainerStyle={s.list}>{videos.length ? videos.map(v => <View key={v.id} style={s.videoCard}><video src={v.video_url} controls playsInline style={{ width: '100%', maxHeight: 560, backgroundColor: '#000', borderRadius: 18 }} /><Text style={s.user}>{v.profiles?.display_name || v.profiles?.username || 'مستخدم DZVibe'}</Text><Text style={s.caption}>{v.caption || ''}</Text><Text style={s.meta}>{v.location_name || 'الجزائر'} · ♥ {v.like_count || 0} · 💬 {v.comment_count || 0}</Text></View>) : <Text style={s.empty}>لا توجد فيديوهات منشورة بعد.</Text>}</ScrollView></View>;
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg, minHeight: '100vh' },
  center: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  box: { width: 'min(92%, 430px)', alignSelf: 'center', marginTop: '12vh', backgroundColor: C.card, borderRadius: 24, padding: 24 },
  logo: { color: C.gold, fontSize: 30, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: C.muted, textAlign: 'center', marginTop: 8, marginBottom: 22 },
  input: { height: 52, backgroundColor: '#080808', borderWidth: 1, borderColor: '#333', borderRadius: 14, color: C.white, paddingHorizontal: 14, marginBottom: 12, textAlign: 'right' },
  button: { height: 54, backgroundColor: C.gold, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#000', fontWeight: '900' },
  error: { color: '#ff7777', textAlign: 'center', marginTop: 12 },
  header: { height: 78, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#222' },
  logout: { color: C.white },
  list: { width: 'min(100%, 760px)', alignSelf: 'center', padding: 18, paddingBottom: 80 },
  videoCard: { backgroundColor: C.card, borderRadius: 20, padding: 10, marginBottom: 18 },
  user: { color: C.white, fontSize: 17, fontWeight: '900', marginTop: 10, textAlign: 'right' },
  caption: { color: '#ddd', marginTop: 6, textAlign: 'right' },
  meta: { color: C.muted, fontSize: 12, marginTop: 8, textAlign: 'right' },
  empty: { color: C.muted, textAlign: 'center', marginTop: 60 }
});
