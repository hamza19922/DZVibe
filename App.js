import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';

const { height } = Dimensions.get('window');

const FEED = [
  { id: '1', user: '@dzvibe', title: 'مرحبا بكم في DZVibe 🇩🇿', description: 'منصة الفيديو الجزائرية الجديدة — أول نسخة تجريبية.', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: '2', user: '@dzvibe', title: 'اكتشف عالم الفيديو القصير', description: 'واجهة عمودية سريعة مصممة للهاتف.', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
];

function FeedCard({ item, active, liked, onLike }) {
  const player = useVideoPlayer(item.video, p => { p.loop = true; p.muted = false; });
  useEffect(() => { if (active) player.play(); else player.pause(); }, [active, player]);
  const actions = [
    { icon: liked ? '♥' : '♡', label: liked ? 'أعجبني' : 'إعجاب', onPress: onLike },
    { icon: '◉', label: 'تعليق', onPress: () => Alert.alert('التعليقات', 'قسم التعليقات جاهز للربط في الخطوة التالية.') },
    { icon: '↗', label: 'مشاركة', onPress: () => Alert.alert('مشاركة', 'ميزة المشاركة جاهزة للربط في الخطوة التالية.') },
    { icon: '☰', label: 'المزيد', onPress: () => Alert.alert('المزيد', 'هذه قائمة خيارات الفيديو.') }
  ];
  return (
    <View style={styles.card}>
      <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} allowsFullscreen allowsPictureInPicture />
      <View pointerEvents="none" style={styles.scrim} />
      <View pointerEvents="none" style={styles.topBar}><Text style={styles.logo}>DZVibe</Text><Text style={styles.badge}>FOR YOU</Text></View>
      <View pointerEvents="none" style={styles.info}><Text style={styles.user}>{item.user}</Text><Text style={styles.title}>{item.title}</Text><Text style={styles.description}>{item.description}</Text></View>
      <View style={styles.actions}>
        {actions.map((action, index) => <Pressable key={index} style={({ pressed }) => [styles.action, pressed && styles.pressed]} onPress={action.onPress} hitSlop={8}><Text style={[styles.actionIcon, liked && index === 0 && styles.liked]}>{action.icon}</Text><Text style={styles.actionText}>{action.label}</Text></Pressable>)}
      </View>
    </View>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [liked, setLiked] = useState(false);
  const [section, setSection] = useState('الرئيسية');
  const selectSection = (name) => { setSection(name); if (name !== 'الرئيسية') Alert.alert(name, `تم فتح قسم ${name}. سنضيف محتواه الكامل في الخطوة التالية.`); };
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.feed}>{FEED.map((item, index) => <View key={item.id} style={styles.cardWrap}><FeedCard item={item} active={active === index} liked={liked} onLike={() => setLiked(value => !value)} /></View>)}</View>
      <View style={styles.bottomNav}>
        <Pressable onPress={() => selectSection('الرئيسية')} style={styles.navButton} hitSlop={8}><Text style={[styles.nav, section === 'الرئيسية' && styles.navActive]}>الرئيسية</Text></Pressable>
        <Pressable onPress={() => selectSection('اكتشف')} style={styles.navButton} hitSlop={8}><Text style={[styles.nav, section === 'اكتشف' && styles.navActive]}>اكتشف</Text></Pressable>
        <Pressable onPress={() => Alert.alert('إضافة فيديو', 'زر الإضافة يعمل الآن. رفع الفيديو سنوصله في الخطوة التالية.')} style={styles.plus} hitSlop={8}><Text style={styles.plusText}>＋</Text></Pressable>
        <Pressable onPress={() => selectSection('الوارد')} style={styles.navButton} hitSlop={8}><Text style={[styles.nav, section === 'الوارد' && styles.navActive]}>الوارد</Text></Pressable>
        <Pressable onPress={() => selectSection('حسابي')} style={styles.navButton} hitSlop={8}><Text style={[styles.nav, section === 'حسابي' && styles.navActive]}>حسابي</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' }, feed: { flex: 1 }, cardWrap: { height }, card: { flex: 1, backgroundColor: '#000', overflow: 'hidden' }, video: { ...StyleSheet.absoluteFillObject }, scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.12)' },
  topBar: { position: 'absolute', top: 46, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, logo: { color: '#FFD400', fontSize: 24, fontWeight: '900' }, badge: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  info: { position: 'absolute', left: 20, right: 92, bottom: 110 }, user: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 8 }, title: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 6 }, description: { color: '#eee', fontSize: 15, lineHeight: 22 },
  actions: { position: 'absolute', right: 12, bottom: 118, alignItems: 'center', gap: 18 }, action: { alignItems: 'center', minWidth: 58, paddingVertical: 3 }, pressed: { opacity: 0.55, transform: [{ scale: 0.94 }] }, actionIcon: { color: '#fff', fontSize: 31, fontWeight: '700' }, liked: { color: '#FFD400' }, actionText: { color: '#fff', fontSize: 11, marginTop: 2 },
  // Lift the app navigation above Android's system navigation area.
  bottomNav: { position: 'absolute', bottom: 24, left: 0, right: 0, height: 64, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.82)', borderRadius: 18, marginHorizontal: 8 },
  navButton: { minWidth: 50, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, nav: { color: '#aaa', fontSize: 11, fontWeight: '700' }, navActive: { color: '#fff', fontSize: 11, fontWeight: '900' }, plus: { width: 48, height: 34, borderRadius: 10, backgroundColor: '#FFD400', alignItems: 'center', justifyContent: 'center' }, plusText: { color: '#000', fontSize: 26, lineHeight: 28, fontWeight: '900' }
});
