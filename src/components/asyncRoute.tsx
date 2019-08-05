import { h, Component } from "preact";

function noop() {}

export default class AsyncRoute extends Component<
  {
    getComponent(url: string, cb: () => any, props: any);
    url: string;
    matches: any;
  },
  {
    componentData?: any;
  }
> {
  constructor() {
    super();
    this.state = {
      componentData: null
    };
  }
  loadComponent = async () => {
    const componentData = await this.props.getComponent(
      this.props.url,
      noop,
      Object.assign({}, this.props, this.props.matches)
    );

    this.setState({
      componentData
    });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.path && this.props.path !== nextProps.path) {
      this.setState(
        {
          componentData: null
        },
        () => {
          this.loadComponent();
        }
      );
    }
  }
  componentWillMount() {
    this.loadComponent();
  }
  render() {
    if (this.state.componentData) {
      // return this.state.componentData; // preactX
      return this.state.componentData.props
        ? this.state.componentData
        : h(this.state.componentData, this.props);
    }
    return null;
  }
}
