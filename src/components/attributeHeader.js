const { React } = window;



export const AttributeHeader = ({ controllerActions, selectedIdx }) => {
  const availableAttributes = controllerActions.Info.getAvailableAttributes();
  const selectedAttr = availableAttributes[selectedIdx] || {};
  return (
    <div>
      <h2>{ selectedAttr.label }</h2>
    </div>
  );
}