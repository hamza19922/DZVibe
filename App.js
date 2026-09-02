import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';

const C = { bg:'#050608', card:'#0d1015', white:'#fff', muted:'#9aa1ad', green:'#25d69a', pink:'#ff3d73' };

function Logo(){ return <View style={s.logoWrap}><Text style={s.logo}>DZVIBE</Text><Text style={s.tag}>🇩🇿 منصة الفيديو الجزائرية</Text></View>; }

function Auth({ onDone }) {
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [busy,setBusy]=useState(false);
  const submit=async()=>{
    if(!email.trim() || pass.length<6) return Alert.alert('بيانات ناقصة','أدخل البريد الإلكتروني وكلمة المرور.');
    setBusy(true);
    try { const r=await supabase.auth.signInWithPassword({email:email.trim(),password:pass}); if(r.error) throw r.error; onDone(r.data.user); }
    catch(e){ Alert.alert('تعذر تسجيل الدخول',e?.message||'حدث خطأ'); }
    finally{setBusy(false);}
  };
  return <View style={s.screen}><StatusBar style="light" hidden/><Logo/><View style={s.card}><Text style={s.title}>مرحبًا بك في DZVibe</Text><Text style={s.sub}>منصة فيديو جزائرية حديثة</Text><TextInput value={email} onChangeText={setEmail} placeholder="البريد الإلكتروني" placeholderTextColor="#707782" autoCapitalize="none" keyboardType="email-address" style={s.input}/><TextInput value={pass} onChangeText={setPass} placeholder="كلمة المرور" placeholderTextColor="#707782" secureTextEntry style={s.input}/><Pressable disabled={busy} onPress={submit} style={s.primary}><Text style={s.primaryText}>{busy?'جارٍ الدخول...':'دخول'}</Text></Pressable></View></View>;
}

function Home({ user }) {
  return <View style={s.home}><StatusBar style="light"/><View style={s.top}><Text style={s.brand}>DZVIBE</Text><Text style={s.tabActive}>لك</Text><Text style={s.tab}>اكتشف</Text><Text style={s.tab}>الأصدقاء</Text><Text style={s.tab}>LIVE</Text></View><View style={s.empty}><Text style={s.big}>🎬</Text><Text style={s.homeTitle}>مرحبًا بك في DZVibe</Text><Text style={s.homeSub}>تم تسجيل الدخول بنجاح. سنعرض الفيديوهات هنا بأمان.</Text><Text style={s.user}>{user?.email||''}</Text><Pressable style={s.create}><Text style={s.createText}>＋ إنشاء فيديو</Text></Pressable></View><View style={s.nav}><Text style={s.navOn}>⌂\nالرئيسية</Text><Text style={s.navItem}>⌕\nاكتشف</Text><Text style={s.navPlus}>＋</Text><Text style={s.navItem}>♡\nالإشعارات</Text><Text style={s.navItem}>◯\nحسابي</Text></View></View>;
}

export default function App(){
  const [loading,setLoading]=useState(true); const [user,setUser]=useState(null);
  useEffect(()=>{ let mounted=true; (async()=>{ try { const {data}=await supabase.auth.getSession(); if(mounted)setUser(data.session?.user||null); } catch(e) {} finally { if(mounted)setLoading(false); }})(); const {data}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null)); return ()=>{mounted=false; data.subscription.unsubscribe();}; },[]);
  if(loading) return <View style={s.splash}><StatusBar style="light" hidden/><Logo/><ActivityIndicator size="large" color={C.green}/><Text style={s.loading}>جارٍ تشغيل DZVibe...</Text></View>;
  return user?<Home user={user}/>:<Auth onDone={setUser}/>;
}

const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',padding:24},splash:{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center'},logoWrap:{alignItems:'center',marginBottom:28},logo:{fontSize:38,fontWeight:'900',letterSpacing:4,color:C.white},tag:{color:C.green,fontSize:14,marginTop:6},card:{width:'100%',maxWidth:440,backgroundColor:C.card,borderRadius:24,padding:22,borderWidth:1,borderColor:'#252a34'},title:{fontSize:25,fontWeight:'800',color:C.white,textAlign:'center'},sub:{fontSize:14,color:C.muted,textAlign:'center',marginTop:8,marginBottom:20},input:{height:52,borderRadius:14,borderWidth:1,borderColor:'#252a34',backgroundColor:'#080a0e',color:C.white,paddingHorizontal:16,marginBottom:12,textAlign:'right'},primary:{height:52,borderRadius:14,backgroundColor:C.green,alignItems:'center',justifyContent:'center',marginTop:4},primaryText:{color:'#000',fontWeight:'900',fontSize:16},loading:{color:C.muted,marginTop:14},home:{flex:1,backgroundColor:'#000'},top:{position:'absolute',zIndex:5,top:50,left:0,right:0,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:10},brand:{color:C.white,fontWeight:'900',fontSize:18},tabActive:{color:C.white,fontWeight:'900',fontSize:16,borderBottomWidth:2,borderBottomColor:C.white,paddingBottom:6},tab:{color:'#aaa',fontSize:15},empty:{flex:1,alignItems:'center',justifyContent:'center',padding:30},big:{fontSize:60,marginBottom:20},homeTitle:{color:C.white,fontSize:24,fontWeight:'800',textAlign:'center'},homeSub:{color:C.muted,fontSize:15,textAlign:'center',marginTop:10},user:{color:C.green,marginTop:14},create:{marginTop:25,backgroundColor:C.green,borderRadius:15,paddingVertical:14,paddingHorizontal:25},createText:{color:'#000',fontWeight:'900'},nav:{position:'absolute',bottom:0,left:0,right:0,height:78,backgroundColor:'#090a0d',borderTopWidth:1,borderTopColor:'#252a34',flexDirection:'row',alignItems:'center',justifyContent:'space-around'},navItem:{color:'#aaa',fontSize:12,textAlign:'center'},navOn:{color:C.white,fontSize:12,textAlign:'center',fontWeight:'800'},navPlus:{color:'#000',backgroundColor:C.white,fontSize:27,fontWeight:'900',width:48,height:38,textAlign:'center',borderRadius:10}}
