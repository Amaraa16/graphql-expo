import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Modal, TextInput } from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import Post from "../components/Post";

const Posts = gql`
  query Posts {
    getPosts {
      text
      _id
    }
  }
`;

const Create_Post = gql`
  mutation CreatePost($postCreateInput: PostInput!) {
    createPost(PostCreateInput: $postCreateInput) {
      text
    }
  }
`;

export default function App() {
  // get posts
  const { data } = useQuery(Posts);

  const [createPost] = useMutation(Create_Post, {
    refetchQueries: [Posts],
  });
  const [text, setText] = useState("");

  // add post popup on/off
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* title */}
      <TouchableOpacity
        style={styles.addbtn}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={{ color: "white", fontSize: 20 }}>Add Post</Text>
      </TouchableOpacity>

      {/* add post model */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="Add post" style={styles.input} onChangeText={(el) => setText(el)}></TextInput>
            <TextInput placeholder="Add image" style={styles.input}></TextInput>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  createPost({
                    variables: {
                      postCreateInput: {
                        text: text,
                      },
                    },
                  });
                  setModalVisible(false);
                }}>
                <Text style={styles.textStyle}>Add Post</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* main posts body */}
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{data?.getPosts.length ? "Posts" : "empty"}</Text>
        {/* mapping the posts */}
        {data?.getPosts.map((el, i) => {
          return <Post text={el.text} id={el._id} key={i} />;
        })}
      </ScrollView>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: 500,
    marginLeft: 120,
    marginBottom: 10,
  },
  addbtn: {
    width: 350,
    height: 50,
    backgroundColor: "blueviolet",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 60,
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    backgroundColor: "lightgrey",
    paddingLeft: 32,
    paddingTop: 15,
  },
  post: {
    width: 350,
    height: 350,
    borderRadius: 10,
    backgroundColor: "black",
    marginBottom: 30,
  },
  dots: {
    color: "white",
    fontSize: 30,
    position: "absolute",
    right: 5,
    top: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: 300,
    height: 215,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 16,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
});
