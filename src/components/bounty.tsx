export const Bounty: React.FC<{
  offenders: string;
  image: string;
  date: Date;
  msg: string;
}> = ({ offenders, image, date, msg }) => {
  return (
    <div className="p-5 w-full flex flex-col gap-3 justify-start max-w-96 bg-kprimarylight text-themetext-800 rounded-3xl shadow-md ">
      <img className="rounded-xl shadow-md  " src={image} />
      <div className="flex flex-col">
        <p className="font-bold text-lg text-shadow-sm text-themeprimary-700 ">
          {offenders}
        </p>
        <p className="text-ktextlight ">{msg} </p>
        <p className="text-sm text-kaccentlight">{date.toDateString()}</p>
      </div>
    </div>
  );
};
