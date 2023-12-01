import classes from "./header.module.css";

export const Header = () => {
  return (
    <div className={`${classes.header} ${classes.blueBackground}`}>
      <a
        href="https://t.me/aisender"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.channelLink}
      >
        AiSender
      </a>
    </div>
  );
};
