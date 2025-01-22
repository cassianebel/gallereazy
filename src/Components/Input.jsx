const Input = ({ label, name, type, value, changeHandler, required }) => {
  return (
    <>
      <label htmlFor={name} className="block mx-2 uppercase">
        {label}
      </label>
      <input
        name={name}
        className="block w-full p-2 mb-2 border border-zinc-300 rounded-md bg-white"
        type={type}
        value={value}
        onChange={changeHandler}
        maxLength={200}
        {...(required && { required: true })}
      />
    </>
  );
};

export default Input;
