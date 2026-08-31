import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './lib/supabase';

export default function UploadVideo({ user, onDone, onCancel }) {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('الجزائر');
  const [busy, setBusy] = useState(false);

  const choose = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('صلاحية مطلوبة', 'اسمح للتطبيق بالوصول إلى الفيديوهات من إعدادات الهاتف.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1 });
    if (!result.canceled) setVideo(result.assets[0]);
  };

  const publish = async () => {
    if (!video) return Alert.alert('اختر فيديو', 'اختر فيديو من الهاتف أولاً.');
    setBusy(true);
    try {
      const ext = (video.fileName?.split('.').pop() || 'mp4').toLowerCase();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const response = await fetch(video.uri);
      const blob = await response.blob();
      const upload = await supabase.storage.from('videos').upload(path, blob, {
        contentType: video.mimeType || 'video/mp4',
        upsert: false,
      });
      if (upload.error) throw upload.error;
      const publicUrl = supabase.storage.from('videos').getPublicUrl(path).data.publicUrl;
      const insert = await supabase.from('videos').insert({
        user_id: user.id,
        caption: caption.trim(),
        video_url: publicUrl,
        storage_path: path,
        location_name: location.trim() || 'الجزائر',
        status: 'published',
        visibility: 'public',
      }).select().single();
      if (insert.error) throw insert.error;
      Alert.alert('تم النشر 🎉', 'تم رفع الفيديو وحفظه في DZVibe.');
      onDone?.(insert.data);
    } catch (e) {
      Alert.alert('تعذر رفع الفيديو', e.message || 'حدث خطأ أثناء الرفع.');
    } finally { setBusy(false); }
  };

  return <View style={s.page}>
    <View style={s.head}><Pressable onPress={onCancel}><Text style={s.close}>×</Text></Pressable><Text style={s.title}>إنشاء فيديو</Text></View>
    <Pressable style={s.pick} onPress={choose}><Text style={s.pickIcon}>＋</Text><Text style={s.pickTitle}>{video ? 'تغيير الفيديو' : 'اختر فيديو من الهاتف'}</Text><Text style={s.muted}>{video ? video.fileName || 'تم اختيار فيديو' : 'سيتم رفعه مباشرة إلى DZVibe'}</Text></Pressable>
    <TextInput value={caption} onChangeText={setCaption} placeholder="اكتب وصف الفيديو..." placeholderTextColor="#777" multiline style={s.input}/>
    <TextInput value={location} onChangeText={setLocation} placeholder="الموقع" placeholderTextColor="#777" style={s.input}/>
    <Pressable disabled={busy} onPress={publish} style={s.publish}><Text style={s.publishText}>{busy ? 'جارٍ الرفع...' : 'نشر الفيديو'}</Text></Pressable>
  </View>;
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#050505',padding:20,paddingTop:55},head:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{color:'#fff',fontSize:25,fontWeight:'900'},close:{color:'#fff',fontSize:34},pick:{height:260,borderRadius:22,borderWidth:1,borderColor:'#333',borderStyle:'dashed',alignItems:'center',justifyContent:'center',marginTop:25,backgroundColor:'#0b0b0b'},pickIcon:{color:'#FFD400',fontSize:50,fontWeight:'300'},pickTitle:{color:'#fff',fontSize:18,fontWeight:'800',marginTop:8},muted:{color:'#777',marginTop:6},input:{minHeight:52,maxHeight:120,borderRadius:15,borderWidth:1,borderColor:'#333',backgroundColor:'#0b0b0b',color:'#fff',paddingHorizontal:15,paddingVertical:12,marginTop:14,textAlign:'right'},publish:{height:56,borderRadius:17,backgroundColor:'#FFD400',alignItems:'center',justifyContent:'center',marginTop:18},publishText:{color:'#000',fontSize:17,fontWeight:'900'}});
