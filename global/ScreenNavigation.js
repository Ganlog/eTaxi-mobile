export default {
  dispatch: null,
  goBack: null,
  navigate: null,
  setParams: null,
  state: Object,

  setNavigate: function(navig){
    this.dispatch = navig.dispatch,
    this.goBack = navig.goBack,
    this.navigate = navig.navigate,
    this.setParams = navig.setParams,
    this.state.key = navig.state.key,
    this.state.routeName = navig.state.routeName
  },

  goto: function(screen, params = null){
    this.navigate(screen, params);
  },
}
