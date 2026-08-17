import React, { useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, Pressable, Image,
  TextInput, ScrollView, Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const people = [
  { id: 1, name: 'Camila', age: 27, city: 'Próximo de você', type: 'Sair hoje', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Juliana', age: 29, city: 'Próximo de você', type: 'Encontro casual', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Marina', age: 26, city: 'Próximo de você', type: 'Conhecer alguém', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85' }
];

function Welcome({ onStart }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.hero}>
        <View style={styles.logoCircle}><Ionicons name="heart" size={38} color="#fff" /></View>
        <Text style={styles.logo}>EncontroJá</Text>
        <Text style={styles.tagline}>Conheça pessoas próximas que procuram o mesmo que você.</Text>
        <View style={styles.feature}>
          <Ionicons name="location-outline" size={22} color="#e91e63" />
          <Text style={styles.featureText}>Pessoas próximas</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="heart-circle-outline" size={22} color="#e91e63" />
          <Text style={styles.featureText}>Match por interesse</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#e91e63" />
          <Text style={styles.featureText}>Ferramentas de segurança</Text>
        </View>
      </View>
      <Pressable style={styles.primary} onPress={onStart}>
        <Text style={styles.primaryText}>Começar gratuitamente</Text>
      </Pressable>
      <Text style={styles.small}>Somente para maiores de 18 anos.</Text>
    </SafeAreaView>
  );
}

function ProfileSetup({ onDone }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [intent, setIntent] = useState('Encontro casual');
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Crie seu perfil</Text>
        <Text style={styles.subtitle}>Você poderá alterar estas informações depois.</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Seu nome" style={styles.input} />
        <Text style={styles.label}>Idade</Text>
        <TextInput value={age} onChangeText={setAge} placeholder="18+" keyboardType="number-pad" style={styles.input} />
        <Text style={styles.label}>O que você procura?</Text>
        {['Encontro casual','Sair hoje','Conhecer alguém','Apenas conversar'].map(x => (
          <Pressable key={x} style={[styles.option, intent === x && styles.optionActive]} onPress={() => setIntent(x)}>
            <Text style={[styles.optionText, intent === x && styles.optionTextActive]}>{x}</Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.primary}
          onPress={() => {
            if (!name || Number(age) < 18) return Alert.alert('Confira seus dados', 'Informe nome e idade igual ou superior a 18 anos.');
            onDone({ name, age, intent });
          }}>
          <Text style={styles.primaryText}>Entrar no EncontroJá</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Discover({ onMatch }) {
  const [index, setIndex] = useState(0);
  const person = people[index % people.length];
  const next = () => setIndex(i => i + 1);
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topbar}>
        <Text style={styles.logoSmall}>EncontroJá</Text>
        <Ionicons name="options-outline" size={25} color="#222" />
      </View>
      <View style={styles.card}>
        <Image source={{ uri: person.image }} style={styles.photo} />
        <View style={styles.cardInfo}>
          <Text style={styles.personName}>{person.name}, {person.age}</Text>
          <Text style={styles.city}><Ionicons name="location-outline" size={15} /> {person.city}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{person.type}</Text></View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.action, styles.no]} onPress={next}><Ionicons name="close" size={32} color="#e53935" /></Pressable>
        <Pressable style={[styles.action, styles.like]} onPress={() => { onMatch(person); next(); }}><Ionicons name="heart" size={30} color="#fff" /></Pressable>
      </View>
      <Text style={styles.hint}>Deslize pela descoberta: ❤️ curtir • ✕ passar</Text>
    </SafeAreaView>
  );
}

function Matches({ matches, onChat }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topbar}><Text style={styles.titleSmall}>Seus Matches</Text></View>
      {matches.length === 0 ? (
        <View style={styles.empty}><Ionicons name="heart-outline" size={58} color="#ddd" /><Text style={styles.emptyTitle}>Ainda não há matches</Text><Text style={styles.emptyText}>Continue descobrindo pessoas para encontrar uma conexão.</Text></View>
      ) : matches.map(p => (
        <Pressable key={p.id} style={styles.matchRow} onPress={() => onChat(p)}>
          <Image source={{ uri: p.image }} style={styles.avatar} />
          <View><Text style={styles.matchName}>{p.name}, {p.age}</Text><Text style={styles.matchSub}>Vocês deram Match! 💖</Text></View>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

function Chat({ person, onBack }) {
  const [text, setText] = useState('');
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topbar}>
        <Pressable onPress={onBack}><Ionicons name="arrow-back" size={26} /></Pressable>
        <Text style={styles.titleSmall}>{person.name}</Text><View />
      </View>
      <View style={styles.chatArea}>
        <Text style={styles.chatWelcome}>Você deu Match com {person.name}! 💖</Text>
      </View>
      <View style={styles.chatInput}>
        <TextInput value={text} onChangeText={setText} placeholder="Escreva uma mensagem..." style={styles.messageInput} />
        <Pressable onPress={() => { setText(''); Alert.alert('Demo', 'Mensagem enviada.'); }}><Ionicons name="send" size={25} color="#e91e63" /></Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [stage, setStage] = useState('welcome');
  const [tab, setTab] = useState('discover');
  const [matches, setMatches] = useState([]);
  const [chatPerson, setChatPerson] = useState(null);

  const addMatch = p => setMatches(prev => prev.some(x => x.id === p.id) ? prev : [...prev, p]);

  if (stage === 'welcome') return <Welcome onStart={() => setStage('profile')} />;
  if (stage === 'profile') return <ProfileSetup onDone={() => setStage('app')} />;
  if (chatPerson) return <Chat person={chatPerson} onBack={() => setChatPerson(null)} />;

  return (
    <SafeAreaView style={styles.screen}>
      {tab === 'discover' ? <Discover onMatch={p => { addMatch(p); Alert.alert('Match! 💖', `Você e ${p.name} deram Match.`); }} /> : <Matches matches={matches} onChat={setChatPerson} />}
      <View style={styles.nav}>
        <Pressable onPress={() => setTab('discover')}><Ionicons name="flame" size={25} color={tab === 'discover' ? '#e91e63' : '#aaa'} /><Text style={styles.navText}>Descobrir</Text></Pressable>
        <Pressable onPress={() => setTab('matches')}><Ionicons name="heart" size={25} color={tab === 'matches' ? '#e91e63' : '#aaa'} /><Text style={styles.navText}>Matches</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#fff'},
  hero:{flex:1,alignItems:'center',justifyContent:'center',padding:28},
  logoCircle:{width:82,height:82,borderRadius:41,backgroundColor:'#e91e63',alignItems:'center',justifyContent:'center',marginBottom:16},
  logo:{fontSize:36,fontWeight:'800',color:'#e91e63'},
  logoSmall:{fontSize:24,fontWeight:'800',color:'#e91e63'},
  titleSmall:{fontSize:21,fontWeight:'800'},
  tagline:{fontSize:17,textAlign:'center',color:'#666',lineHeight:25,marginTop:12,marginBottom:35},
  feature:{flexDirection:'row',alignItems:'center',width:'90%',paddingVertical:10},
  featureText:{fontSize:16,marginLeft:12,color:'#333'},
  primary:{backgroundColor:'#e91e63',marginHorizontal:24,borderRadius:14,paddingVertical:16,alignItems:'center',marginBottom:10},
  primaryText:{color:'#fff',fontSize:17,fontWeight:'700'},
  small:{textAlign:'center',fontSize:12,color:'#999',marginBottom:16},
  form:{padding:24},
  title:{fontSize:29,fontWeight:'800',marginBottom:6},
  subtitle:{color:'#777',marginBottom:25},
  label:{fontWeight:'700',marginBottom:8,marginTop:14},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:12,padding:14,fontSize:16},
  option:{borderWidth:1,borderColor:'#ddd',borderRadius:12,padding:15,marginBottom:10},
  optionActive:{borderColor:'#e91e63',backgroundColor:'#fff0f5'},
  optionText:{fontSize:15},
  optionTextActive:{color:'#e91e63',fontWeight:'700'},
  topbar:{height:62,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20},
  card:{marginHorizontal:18,borderRadius:20,overflow:'hidden',backgroundColor:'#f5f5f5',flex:1},
  photo:{width:'100%',height:'78%'},
  cardInfo:{padding:14},
  personName:{fontSize:25,fontWeight:'800'},
  city:{fontSize:14,color:'#777',marginTop:3},
  badge:{alignSelf:'flex-start',backgroundColor:'#fff0f5',paddingHorizontal:12,paddingVertical:7,borderRadius:20,marginTop:8},
  badgeText:{color:'#e91e63',fontWeight:'700'},
  actions:{flexDirection:'row',justifyContent:'center',gap:22,paddingVertical:13},
  action:{width:62,height:62,borderRadius:31,alignItems:'center',justifyContent:'center',borderWidth:1},
  no:{borderColor:'#e53935',backgroundColor:'#fff'},
  like:{borderColor:'#e91e63',backgroundColor:'#e91e63'},
  hint:{textAlign:'center',color:'#999',fontSize:12,marginBottom:6},
  nav:{height:70,borderTopWidth:1,borderTopColor:'#eee',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},
  navText:{fontSize:11,color:'#777',marginTop:2},
  empty:{flex:1,alignItems:'center',justifyContent:'center',padding:40},
  emptyTitle:{fontSize:20,fontWeight:'800',marginTop:14},
  emptyText:{textAlign:'center',color:'#888',marginTop:8,lineHeight:21},
  matchRow:{flexDirection:'row',alignItems:'center',padding:15,borderBottomWidth:1,borderBottomColor:'#eee'},
  avatar:{width:58,height:58,borderRadius:29,marginRight:14},
  matchName:{fontSize:17,fontWeight:'700'},
  matchSub:{color:'#e91e63',marginTop:3},
  chatArea:{flex:1,alignItems:'center',justifyContent:'center'},
  chatWelcome:{color:'#888'},
  chatInput:{flexDirection:'row',alignItems:'center',borderTopWidth:1,borderTopColor:'#eee',padding:10},
  messageInput:{flex:1,borderWidth:1,borderColor:'#ddd',borderRadius:22,paddingHorizontal:16,paddingVertical:10,marginRight:10}
});
