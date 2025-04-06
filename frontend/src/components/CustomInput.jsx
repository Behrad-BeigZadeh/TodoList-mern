import PropTypes from "prop-types";

export const CustomInput = (props) => {
  const { buttonValue, Change, value, Holder, buttonClick } = props;
  return (
    <>
      <input
        value={value}
        onChange={Change}
        placeholder={Holder}
        className="p-1 md:min-w-[100%] min-w-[80%] border-slate-900 border-[2px] text-slate-950 rounded-sm"
      />
      <button
        onClick={buttonClick}
        className="ml-1 bg-slate-800 p-1 md:min-w-[80px] rounded-sm text-slate-300 hover:bg-slate-950 hover:text-slate-300"
      >
        {buttonValue}
      </button>
    </>
  );
};

CustomInput.propTypes = {
  buttonValue: PropTypes.string.isRequired,
  Change: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  Holder: PropTypes.string.isRequired,
  buttonClick: PropTypes.func.isRequired,
};
