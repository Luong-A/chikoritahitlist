export const Bounty: React.FC<{ offenders: string; image: string; date: Date; msg: string}> = ({
  offenders,
  image,
  date,
  msg
}) => {
  return (
    <div className="p-5 m-7 flex flex-col gap-3 justify-center w-4/5 max-w-96 bg-kprimarylight text-themetext-800 dark:bg-kprimarydark rounded-3xl shadow-md  dark:shadow-darkprimary-800 ">
      <img className="rounded-xl shadow-md  " src={image} />
      <div className="flex flex-col">
        <p className="font-bold text-lg text-shadow-sm text-themeprimary-700 ">
          {offenders}
        </p>
        <p className="text-ktextlight ">{msg} </p>
        <p className="text-sm text-kaccentlight dark:text-[oklch(0.4709 0.055 192.1)] ">
          {date.toDateString()}
        </p>
      </div>
    </div>
  );
};
