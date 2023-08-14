import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";

const Posts = gql`
  query Posts {
    getPosts {
      text
      _id
    }
  }
`;

const Delete_Post = gql`
  mutation DeletePost($deletePostId: ID!) {
    deletePost(id: $deletePostId)
  }
`;

const Update_Post = gql`
  mutation UpdatePost($updatePostId: ID!, $postUpdateInput: PostInput!) {
    updatePost(id: $updatePostId, PostUpdateInput: $postUpdateInput) {
      text
    }
  }
`;

export default function Post({ text, id }) {
  // get posts
  const { data } = useQuery(Posts);

  const [deletePost] = useMutation(Delete_Post, { refetchQueries: [Posts] });
  const [updatePost] = useMutation(Update_Post, { refetchQueries: [Posts] });

  // add update popup on/off
  const [modalVisible, setModalVisible] = useState(false);

  // edit popup on/off
  const [open, setOpen] = useState(false);

  const [updateText, setUpdateText] = useState("");

  return (
    <View style={styles.post}>
      <Text style={{ color: "white", fontSize: "45px" }}>{text}</Text>

      {/* three dots */}
      <Entypo name="dots-three-vertical" style={styles.dots} onPress={() => setOpen(!open)} />

      {/* edit popup */}
      <View style={{ width: 125, height: 125, backgroundColor: "white", justifyContent: "space-evenly", alignItems: "center", borderRadius: 10, opacity: open ? 1 : 0, position: "absolute", top: 55, right: 17 }}>
        <Text style={{ fontSize: 25 }} onPress={() => setModalVisible(true)}>
          Update
        </Text>
        <View style={{ width: 125, height: 2, backgroundColor: "grey" }}></View>
        <Text
          style={{ fontSize: 25 }}
          onPress={() => {
            deletePost({
              variables: {
                deletePostId: id,
              },
            });
          }}>
          Delete
        </Text>
      </View>

      {/* edit update popup */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="Change Text" style={styles.input} onChangeText={(el) => setUpdateText(el)}></TextInput>
            <TextInput placeholder="Change image" style={styles.input}></TextInput>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  updatePost({
                    variables: {
                      updatePostId: id,
                      postUpdateInput: {
                        text: updateText,
                      },
                    },
                  });
                  setModalVisible(false);
                }}>
                <Text style={styles.textStyle}>Update Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  post: {
    width: 350,
    height: 350,
    borderRadius: 10,
    backgroundColor: "black",
    marginBottom: 30,
    alignItems: "center",
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
