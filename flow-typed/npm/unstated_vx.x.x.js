import { type Node, Component } from 'React';
declare module 'unstated' {
  declare export class Container<State: {}> {
    state: State;
    setState(
      updater: $Shape<State> | ((prevState: $Shape<State>) => $Shape<State>),
      callback?: () => void
    ): Promise<void>;
  }
  declare export type ContainerType = Container<Object>
  declare export type ContainersType = Array<ContainerType>
  declare export type ProviderProps = {
    inject?: Array<ContainerType>,
    children: Node
  }
  declare export function Provider(ProviderProps): Node
  declare export type SubscribeProps<Containers: ContainersType> = {
    to: Containers,
    children: (
      ...instances: $TupleMap<Containers, <C>(Class<C> | C) => C>
    ) => Node
  }
  declare export class Subscribe<Containers: ContainersType> extends Component<SubscribeProps<Containers>> {}
}