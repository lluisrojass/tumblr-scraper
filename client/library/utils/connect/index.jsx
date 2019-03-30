// @flow 
import  {
  Subscribe,
  type ContainersType
} from 'unstated';
import * as React from 'react';

export type TupleT<Containers> = $TupleMap<
  Containers, 
  <C>(Class<C> | C) => C
>;
export type SelectorFn<Containers, SelectorOutcome> = 
  (...TupleT<Containers>) => SelectorOutcome;

function connect<
  Props: {},
  SelectorOutcome: {},
  ContainersT: ContainersType
>(
  Containers: ContainersT,
  selector: SelectorFn<ContainersT, SelectorOutcome>,
  Component: React.ComponentType<
    $Exact<SelectorOutcome> & Props
  > 
): React.StatelessFunctionalComponent<Props> {
  return (props: Props) => (
    <Subscribe to={Containers}>
      { (...containers: TupleT<ContainersT>) => (
        Component && 
          <Component 
            {...props} 
            {...selector(...containers)} 
          />
      )}
    </Subscribe>
  );
}

export default connect;