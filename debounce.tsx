import * as React from 'react';

/** 
 * A component wrapper that adds a delay to the onChange handler to improve 
 * performance.
 */
export function debounceOnChange<P extends { onChange?: React.ChangeEventHandler<Element> }>(
  Component: React.ComponentType<P>): React.ComponentType<P & { debounceTimeout: number }> {
  return ({ onChange, debounceTimeout, ...props }) => {
    if (!onChange) {
      return <Component {...props as P} />;
    }
    const [id, setId] = React.useState<ReturnType<typeof setTimeout>>();
    const resetId = () => id && clearTimeout(id);
    const handleOnChange = (event: React.ChangeEvent<Element>) => {
      resetId();
      setId(setTimeout(() => onChange(event), debounceTimeout));
    };

    React.useEffect(() => resetId);

    return <Component onChange={handleOnChange} {...props as P} />
  };
}
