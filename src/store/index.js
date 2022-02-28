import { createStore } from 'vuex'

export default createStore({
  state: {
    sideNav: false,
    tasks: []
  },
  getters: {
  },
  mutations: {
    // stateのsideNavの状態を切り替え
    toggleSideNav(state) {
      state.sideNav = !state.sideNav
    },
    addTask(state, task) {
      state.tasks.push(task)
    }
  },
  actions: {
    // toggleSideNavのクリックイベントが呼び出されたら実行
    // commitメソッドでmutationsのtoggleSideNavを発火
    toggleSideNav({ commit }) {
      commit('toggleSideNav')
    },
    addTask({ commit }, task) {
      commit('addTask', task)
    }
  },
  modules: {
  }
})
