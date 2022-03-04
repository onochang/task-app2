import { createStore } from 'vuex'
// Googleプロバイダをimport
import { GoogleAuthProvider } from "firebase/auth";
// Google認証機能をimport
import { getAuth, signInWithRedirect, signOut } from "firebase/auth";
// firestoreをimport
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default createStore({
  state: {
    login_user: null,
    sideNav: false,
    tasks: []
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : '',
    // パラメーターから受け取ったidに一致するtaskオブジェクトを参照
    getAddressById: state => id => state.tasks.find( task => task.id === id)
  },
  mutations: {
    setLoginUser(state, user) {
      state.login_user = user
    },
    deleteLoginUser(state) {
      state.login_user = null
    },
    // stateのsideNavの状態を切り替え
    toggleSideNav(state) {
      state.sideNav = !state.sideNav
    },
    addTask(state, { id, task }) {
      // taskオブジェクトにidを追加
      task.id = id
      state.tasks.push(task)
    },
    updateTask(state, { id, task }) {
      // tasksの中からパラメーターと一致するtaskオブジェクトのインデックスを取得
      const index = state.tasks.findIndex(task => task.id === id)
      state.tasks[index] = task
    },
    deleteTask(state, id) {
      const index = state.tasks.findIndex(task => task.id === id)
      state.tasks.splice(index, 1)
    }
  },
  actions: {
    setLoginUser({ commit }, user) {
      commit('setLoginUser', user)
    },
    // アプリ側のログアウト
    deleteLoginUser({ commit }) {
      commit('deleteLoginUser')
    },
    login() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithRedirect(auth, provider);
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
    },
    // toggleSideNavのクリックイベントが呼び出されたら実行
    // commitメソッドでmutationsのtoggleSideNavを発火
    toggleSideNav({ commit }) {
      commit('toggleSideNav')
    },

    async addTask({ getters, commit }, task) {
      // firestoreに接続
      const db = getFirestore();
      try {
        if (getters.uid) {
          // firestoreにデータを追加
          const docRef = await addDoc(collection(db, `users/${getters.uid}/tasks`), task);
          console.log(docRef);
          console.log("Document written with ID: ", docRef.id);
          commit('addTask', { id: docRef.id, task })
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async fetchTasks({ getters, commit }) {
      const db = getFirestore();
      // firestoreからコレクションの中身を取得
      const querySnapshot = await getDocs(collection(db, `users/${getters.uid}/tasks`));
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log(doc);
        commit('addTask', { id: doc.id, task: doc.data() })
        console.log(`${doc.id} => ${doc.data()}`);
      });
    },
    async updateTask({ getters, commit }, { id, task }) {
      const db = getFirestore();
      // 編集するドキュメントを参照
      const editTask = doc(db, `users/${getters.uid}/tasks`, id);
      console.log(editTask);
      await updateDoc(editTask, {
        title: task.title,
        start: task.start,
        end: task.end
      }); 
      commit('updateTask',{ id, task })
    },
    async deleteTask({ getters, commit }, id) {
      const db = getFirestore();
      await deleteDoc(doc(db, `users/${getters.uid}/tasks`, id)); 
      commit('deleteTask', id)
    }
  },
  modules: {
  }
})
