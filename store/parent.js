export const state = () => ({
  childStatus: [],
});

export const mutations = {
  setChildStatus(state, v) {
    state.childStatus = v;
  },
};
