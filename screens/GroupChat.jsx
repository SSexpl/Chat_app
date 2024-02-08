import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useEffect,useState } from 'react';
import { app, db } from '../firebase'; // Import your Firebase configuration
import { onAuthStateChanged,getAuth } from 'firebase/auth';
import { doc,query,where, onSnapshot,collection ,getDocs,getDoc,addDoc} from "firebase/firestore";
const GroupChat = ({ route }) => {

 //   console.log( route.params);
  
 const {fromId,groupId,groupName,fromName}=route.params;
  const [chats,setChats]=useState(null);

  const [message, setMessage] = useState('');
 
  //console.log(chats);

  const handleSendMessage = async() => {
    // Implement sending message logic here
    console.log('Message sent:', message);
    try{
    const currentTimestamp = new Date().getTime();
   data={ fromID:fromId,groupID:groupId,fromName:fromName,groupName:groupName ,message:message,timeStamp:currentTimestamp,type:"group"};
  //  console.log(data);
    const docRef = await addDoc(collection(db, "chats"), {
       ...data
      
    });

    getMessages();
    }
    catch(err)
    {
        console.log(err);
    }
    // Clear the message input after sending
    setMessage('');
  };
 const getMessages=async()=>
 {
    const colRef=collection(db,"chats");
    const q = query(
        colRef,
        where('groupID', '==', groupId),
        where('type', '==', "group")
      );
    const querySnapshot = await getDocs(q);
    const temp=[];
    querySnapshot.forEach((doc) => {
     // doc.data() is never undefined for query doc snapshots
     temp.push(doc.data());
    
   });
//   console.log("first temp",temp);
  
  temp.sort((a, b) => a.timeStamp - b.timeStamp);
  // console.log("temp",temp);
   setChats(temp);
//   console.log("chats",chats);
 }
 useEffect(()=>
 {getMessages()},[]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{groupName}</Text>
      </View>

      {/* Chat area */}
      {chats&&<ScrollView style={styles.chatArea}>
        {
        chats.map((chat, index) => (
          <View key={index} style={styles.chatItem}>
            <View style={{backgroundColor:chat.fromID==fromId?'black':'#37d67a'}}>
            <Text style={styles.from}>{chat.fromName}</Text>
            <Text style={styles.timestamp}>{new Date(chat.timeStamp).toLocaleDateString() }  {new Date(chat.timeStamp).toLocaleTimeString() }</Text>
            </View>
            <Text style={styles.message}>{chat.message}</Text>
          </View>
        ))}
      </ScrollView>
       }
      {/* Message input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#50f5a2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  chatArea: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    marginBottom: 10,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    color: '#666',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#50f5a2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  from:{
    color:'white'
  },
  message:
  {
    borderWidth: 1,
        borderBottomColor: '#ccc',
        color:'black',
        padding:5,
  }
});

export default GroupChat;
