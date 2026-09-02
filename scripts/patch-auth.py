from pathlib import Path

path = Path('App.js')
text = path.read_text(encoding='utf-8')

if "import * as Linking from 'expo-linking';" not in text:
    text = text.replace(
        "import{StatusBar}from'expo-status-bar';",
        "import{StatusBar}from'expo-status-bar';\nimport * as Linking from 'expo-linking';",
        1,
    )

start = text.index('function Auth({done}){')
end = text.index('function Action(', start)

new_auth = r'''function PasswordRecovery({onDone}){const[pass,setPass]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false);const save=async()=>{if(pass.length<6)return Alert.alert('كلمة المرور ضعيفة','استخدم 6 أحرف على الأقل.');if(pass!==confirm)return Alert.alert('كلمتا المرور مختلفتان','أعد كتابة كلمة المرور نفسها.');setBusy(true);const r=await supabase.auth.updateUser({password:pass});setBusy(false);if(r.error)return Alert.alert('تعذر تغيير كلمة المرور',r.error.message);Alert.alert('تم تغيير كلمة المرور ✓','يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',[{text:'حسنًا',onPress:async()=>{await supabase.auth.signOut();onDone?.()}}])};return <View style={s.auth}><StatusBar style="light" hidden/><Logo/><View style={s.authCard}><Text style={s.authTitle}>تعيين كلمة مرور جديدة</Text><Text style={s.switch}>أدخل كلمة مرور جديدة لحماية حسابك.</Text><TextInput value={pass}onChangeText={setPass}placeholder="كلمة المرور الجديدة"placeholderTextColor="#777"secureTextEntry style={s.input}/><TextInput value={confirm}onChangeText={setConfirm}placeholder="تأكيد كلمة المرور"placeholderTextColor="#777"secureTextEntry style={s.input}/><Pressable disabled={busy}onPress={save}style={[s.primary,busy&&{opacity:.6}]}><Text style={s.primaryText}>{busy?'جارٍ الحفظ...':'حفظ كلمة المرور'}</Text></Pressable></View></View>}
function Auth({done}){const[signup,setSignup]=useState(false),[recovery,setRecovery]=useState(false),[email,setEmail]=useState(''),[pass,setPass]=useState(''),[name,setName]=useState(''),[busy,setBusy]=useState(false);const submit=async()=>{if(!email.trim()||pass.length<6||(signup&&!name.trim()))return Alert.alert('بيانات ناقصة','أدخل البيانات المطلوبة.');setBusy(true);try{if(signup){const r=await supabase.auth.signUp({email:email.trim(),password:pass,options:{data:{name:name.trim()}}});if(r.error)throw r.error;if(!r.data.user)throw Error('تعذر إنشاء الحساب');if(r.data.session){const username=`user_${r.data.user.id.replace(/-/g,'').slice(0,12)}`;const p=await supabase.from('profiles').upsert({id:r.data.user.id,username,display_name:name.trim(),bio:''},{onConflict:'id'});if(p.error)throw p.error;done(r.data.user)}else Alert.alert('تم إنشاء الحساب ✓','افتح بريدك الإلكتروني وأكّد الحساب، ثم سجّل الدخول.');setSignup(false)}else{const r=await supabase.auth.signInWithPassword({email:email.trim(),password:pass});if(r.error)throw r.error;done(r.data.user)}}catch(e){Alert.alert('تعذر المتابعة',e?.message||'حدث خطأ')}finally{setBusy(false)}};const reset=async()=>{if(!email.trim())return Alert.alert('أدخل البريد الإلكتروني','اكتب بريد حسابك أولًا.');setBusy(true);try{const redirectTo=Linking.createURL('reset');const r=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo});if(r.error)throw r.error;Alert.alert('تم إرسال رابط الاستعادة ✓','افتح بريدك الإلكتروني واضغط رابط استعادة كلمة المرور. سيعود بك إلى تطبيق DZVibe.')}catch(e){Alert.alert('تعذر إرسال رابط الاستعادة',e?.message||'حدث خطأ')}finally{setBusy(false)}};if(recovery)return <View style={s.auth}><StatusBar style="light" hidden/><Logo/><View style={s.authCard}><Text style={s.authTitle}>استعادة الحساب</Text><Text style={s.switch}>أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابطًا آمنًا لإعادة كلمة المرور.</Text><TextInput value={email}onChangeText={setEmail}placeholder="البريد الإلكتروني"placeholderTextColor="#777"autoCapitalize="none"keyboardType="email-address"style={s.input}/><Pressable disabled={busy}onPress={reset}style={[s.primary,busy&&{opacity:.6}]}><Text style={s.primaryText}>{busy?'جارٍ الإرسال...':'إرسال رابط الاستعادة'}</Text></Pressable><Pressable onPress={()=>setRecovery(false)}><Text style={s.switch}>العودة إلى تسجيل الدخول</Text></Pressable></View></View>;return <View style={s.auth}><StatusBar style="light" hidden/><Logo/><View style={s.authCard}><Text style={s.authTitle}>{signup?'إنشاء حساب':'تسجيل الدخول'}</Text>{signup&&<TextInput value={name}onChangeText={setName}placeholder="اسم العرض"placeholderTextColor="#777"style={s.input}/>}<TextInput value={email}onChangeText={setEmail}placeholder="البريد الإلكتروني"placeholderTextColor="#777"autoCapitalize="none"keyboardType="email-address"style={s.input}/><TextInput value={pass}onChangeText={setPass}placeholder="كلمة المرور (6 أحرف على الأقل)"placeholderTextColor="#777"secureTextEntry style={s.input}/><Pressable disabled={busy}onPress={submit}style={[s.primary,busy&&{opacity:.6}]}><Text style={s.primaryText}>{busy?'جارٍ التنفيذ...':signup?'إنشاء الحساب':'دخول'}</Text></Pressable>{!signup&&<Pressable onPress={()=>setRecovery(true)}><Text style={s.switch}>نسيت كلمة المرور؟</Text></Pressable>}<Pressable onPress={()=>setSignup(!signup)}><Text style={s.switch}>{signup?'لديك حساب؟ تسجيل الدخول':'ليس لديك حساب؟ إنشاء حساب'}</Text></Pressable></View></View>}
'''
text = text[:start] + new_auth + text[end:]

old_state = "[report,setReport]=useState(null),[loading,setLoading]=useState(true)"
if old_state in text:
    text = text.replace(old_state, "[report,setReport]=useState(null),[recovery,setRecovery]=useState(false),[loading,setLoading]=useState(true)", 1)

old_effect = "useEffect(()=>{let mounted=true;(async()=>{const r=await supabase.auth.getSession();if(r.data.session){setUser(r.data.session.user);await load(r.data.session.user)}if(mounted)setLoading(false)})();const sub=supabase.auth.onAuthStateChange((_e,session)=>{if(session){setUser(session.user);load(session.user)}else{setUser(null);setProfile(null);setTab('home')}});return()=>{mounted=false;sub.data.subscription.unsubscribe()}},[load]);"
new_effect = r'''const deepLinkUrl=Linking.useURL();
 useEffect(()=>{if(!deepLinkUrl)return;const parsed=Linking.parse(deepLinkUrl);const code=parsed.queryParams?.code;if(code)supabase.auth.exchangeCodeForSession(String(code)).catch(e=>Alert.alert('تعذر فتح رابط الاستعادة',e?.message||'أعد طلب رابط جديد.'))},[deepLinkUrl]);
 useEffect(()=>{let mounted=true;(async()=>{const r=await supabase.auth.getSession();if(r.data.session){setUser(r.data.session.user);await load(r.data.session.user)}if(mounted)setLoading(false)})();const sub=supabase.auth.onAuthStateChange((_e,session)=>{if(_e==='PASSWORD_RECOVERY'){setRecovery(true);setUser(null);return}if(session){setUser(session.user);load(session.user)}else{setUser(null);setProfile(null);setTab('home')}});return()=>{mounted=false;sub.data.subscription.unsubscribe()}},[load]);'''
if old_effect not in text:
    raise SystemExit('auth state effect pattern not found')
text = text.replace(old_effect, new_effect, 1)

old_render = "if(loading)return <View style={s.loading}><Logo/><Spinner/></View>;if(!user)return <Auth done={async u=>{setUser(u);await load(u)}}/>;"
if old_render not in text:
    raise SystemExit('render pattern not found')
text = text.replace(old_render, "if(loading)return <View style={s.loading}><Logo/><Spinner/></View>;if(recovery)return <PasswordRecovery onDone={()=>setRecovery(false)}/>;if(!user)return <Auth done={async u=>{setUser(u);await load(u)}}/>;", 1)

path.write_text(text, encoding='utf-8')
