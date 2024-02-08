import { StatusBar } from 'expo-status-bar';
import { useState,useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, ScrollView,FlatList,Image } from 'react-native';
import {app,auth,db} from '../firebase'; 
import {getAuth,onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { doc,query,where, onSnapshot,collection ,getDocs,getDoc} from "firebase/firestore";
// this page shall show the other 2 users and 1 group chat 
// we need a user schema
// we need a messsage schema 

//Step 1 is to show those 2 users and the group chat of which the person is part of ... 
const Home=({navigation})=>
{
    const[user,setUser]=useState({});
    const[friends,setAllFriends]=useState(null);
    const [loading,setLoading]=useState(false);

    const curUser=async()=>{

     const unsubscribe = onAuthStateChanged(auth, async(user) => {
        if (user) {
          // User is signed in
         // console.log(user);
         const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        //console.log("user",docSnap.data());
          setUser({uid:user.uid,...docSnap.data()});
        } else {
          // User is signed out
          setUser(null);
          navigation.navigate('Login')
        }
      });
      return () => unsubscribe();
    }

    const getFriends=async ()=>
    {
        try{
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            const temp = [];
            const usercr = auth.currentUser;
            querySnapshot.forEach((doc) => {
                // Accessing the uid field from each user document
                const userData = doc.data();
                const userUid = doc.id;
               // console.log(doc.id);
                // Pushing the user data along with uid
                temp.push({ uid: userUid, ...userData,type:"single" });
          

        
    });

    const filteredTemp = temp.filter(tempItem =>tempItem.uid!=usercr.uid);
    filteredTemp.push({groupId:"123",name:"Chat Group",type:"group"});
    setAllFriends(filteredTemp);
     console.log("friends",friends);
    }
    catch(err)
    {
       console.log(err);
    }

    }
    const getAll =async()=>
    {
        setLoading(true);
       const res= await curUser();
        const res2=await getFriends();
        setLoading(false);

    }
    useEffect(() => {
      
       
        getAll();
      }, []); 
    
      const handleLogout=()=>
      {
         signOut(auth).then(() => {
             // Sign-out successful.
           console.log("signing out")
           }).catch((error) => {
             // An error happened.
             console.log(error);
           });
      }
  
       const handleFriendPress =async(item)=>
       {

        const send={
            toId:item.uid,
            fromId:user.uid,
            toName:item.name,
            fromName:user.name
        };
        navigation.navigate('SingleChat', { ...send });
       }
       const handleGroupPress=()=>
       {
        console.log("group");
        const send={
            groupId:"123",
            groupName:"abc",
            fromId:user.uid,
            fromName:user.name
        };
        navigation.navigate('GroupChat', { ...send });
       }
   
      const renderFriendItem = ({ item }) => {
        console.log("Rendering item:", item);
        if(item.type=="single"){
        return (
          <TouchableOpacity onPress={() => handleFriendPress(item)}>
            <View style={styles.friendItem}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png'
                }}
              />
              <Text style={styles.name}>{item.name}</Text>
              
            </View>
          </TouchableOpacity>
        );
        }
        else
        {
            return (
                <TouchableOpacity onPress={() => handleGroupPress()}>
                  <View style={styles.friendItem}>
                    <Image
                      style={styles.profileImage}
                      source={{
                        uri: 'https://www.shutterstock.com/image-vector/chat-icon-people-group-260nw-437341633.jpg'
                      }}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    
                  </View>
                </TouchableOpacity>
            );
        }
      };
      
     
  if(loading)
  {
  return(<View style={styles.LoadContainer}><Image source={{uri:'https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif'}} style={styles.image}></Image></View>
  );
  }
      if(!user)
      {
        return(<Text>Loading...</Text>)
      }
    return (
        <View style={styles.fullContainer}>
        <View style={styles.topcontainer}>
      <View style={styles.userInfo}>
        
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.container}>
    {friends &&  // Check if friends is not null or undefined
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => {if(item.uid) return(item.uid.toString()); else  return(item.groupId)}}
          />
        }
          
    </View>
   
    

    </View>
      );
      
}
const styles = StyleSheet.create({
    fullContainer:
    {
        flex:1
    },
    topcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#50f5a2',
      },
      userInfo: {
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
      username: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      email: {
        fontSize: 14,
        color: '#666',
      },
      logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
      },
      logoutText: {
        color: 'white',
        fontWeight: 'bold',
      },
      container: {
        flexDirection:'column',
        paddingHorizontal: 20,
        paddingTop: 10,
      },
      friendItem: {
        flexDirection: 'row',
        flex:1,
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color:'black'
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25, // assuming the profile image is circular
        marginRight: 10,
      },
      name: {
        fontSize: 16,
        color:'black'
      },
      LoadContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
      groupItem: {
        flexDirection: 'row',
        flex:1,
        alignItems: 'center',
        padding: 10,
        paddingVertical:25,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color:'black',
        marginVertical:20,
        
      },
  });
  
export default Home;
