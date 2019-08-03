declare module "*.mdx" {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
  export const metadata: {
    title: string;
    author: string;
    tags: string[];
    timestamp: Date;
  }
}
