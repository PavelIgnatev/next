import classes from "./view-dialog__header.module.css";

export interface ViewDialogHeaderProps {

}

export const ViewDialogHeader = (props: ViewDialogHeaderProps) => {
  const {

  } = props;

  return (
    <div className={`${classes.viewDialogHeader} ${classes.blueBackground}`}>
      <a href="https://t.me/aisender" target="_blank" rel="noopener noreferrer" className={classes.channelLink}>
        AiSender
      </a>
    </div>
  );
};