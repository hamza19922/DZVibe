import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';

const { height } = Dimensions.get('window');

const FEED = [
  {
    id: '1',
    user: '@dzvibe',
    title: 'مرحبا بكم في DZVibe 🇩🇿',
    description: 'منصة الفيديو الجزائرية الجديدة — أول نسخة تجريبية.',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    user: '@dzvibe',
    title: 'اكتشف عالم الفيديو القصير',
    description: 'واجهة عمودية سريعة مصممة للهاتف.',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  }
];

function FeedCard({ item, active }) {
  const player = useVideoPlayer(item.video, p => {
    p.loop = true;
    p.muted = false;
  });

  useEffect(() => {
    if (active) player.play();
    else player.pause();
  }, [active, player]);

  return (
    <View style={styles.card}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.scrim} />
      <View style={styles.topBar}>
        <Text style={styles.logo}>DZVibe</Text>
        <Text style={styles.badge}>FOR YOU</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.actions}>
        {['♡', '◉', '↗', '☰'].map((icon, index) => (
          <Pressable key={index} style={styles.action}>
            <Text style={styles.actionIcon}>{icon}</Text>
            <Text style={styles.actionText}>{['إعجاب', 'تعليق', 'مشاركة', 'المزيد'][index]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.feed}>
        {FEED.map((item, index) => (
          <Pressable key={item.id} style={styles.cardWrap} onPress={() => setActive(index)}>
            <FeedCard item={item} active={active === index} />
          </Pressable>
        ))}
      </View>
      <View style={styles.bottomNav}>
        <Text style={styles.navActive}>الرئيسية</Text>
        <Text style={styles.nav}>اكتشف</Text>
        <View style={styles.plus}><Text style={styles.plusText}>＋</Text></View>
        <Text style={styles.nav}>الوارد</Text>
        <Text style={styles.nav}>حسابي</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  feed: { flex: 1 },
  cardWrap: { height: height },
  card: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  video: { ...StyleSheet.absoluteFillObject },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.12)' },
  topBar: { position: 'absolute', top: 46, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#FFD400', fontSize: 24, fontWeight: '900' },
  badge: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  info: { position: 'absolute', left: 20, right: 92, bottom: 110 },
  user: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 6 },
  description: { color: '#eee', fontSize: 15, lineHeight: 22 },
  actions: { position: 'absolute', right: 12, bottom: 118, alignItems: 'center', gap: 18 },
  action: { alignItems: 'center', minWidth: 58 },
  actionIcon: { color: '#fff', fontSize: 31, fontWeight: '700' },
  actionText: { color: '#fff', fontSize: 11, marginTop: 2 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, paddingHorizontal: 18, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.78)' },
  nav: { color: '#aaa', fontSize: 11, fontWeight: '700' },
  navActive: { color: '#fff', fontSize: 11, fontWeight: '900' },
  plus: { width: 48, height: 34, borderRadius: 10, backgroundColor: '#FFD400', alignItems: 'center', justifyContent: 'center' },
  plusText: { color: '#000', fontSize: 26, lineHeight: 28, fontWeight: '900' }
});
