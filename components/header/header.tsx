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
        <svg
          width="246"
          height="26"
          viewBox="0 0 246 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "scale(0.7)", marginBottom: "1px" }}
        >
          <path
            d="M35.6861 1.81537V23.9061C35.6861 25.0316 34.3451 25.9495 32.7008 25.9495C30.8625 25.9495 29.2944 25.2824 29.2944 23.9061V21.2319H6.28058V23.8687C6.28058 24.9942 4.93959 25.9121 3.29527 25.9121C1.49845 25.9121 0 25.178 0 23.8687V1.81537C0 0.815781 1.1918 0 2.65213 0H33.0356C34.4959 0 35.6861 0.815781 35.6861 1.81537ZM121.294 5.8001C122.497 5.8001 123.077 6.13935 123.806 6.70892L141.778 19.6899V7.47137C141.778 6.5512 142.879 5.79783 144.225 5.79783C145.58 5.79783 146.689 6.54099 146.689 7.47137V23.5056C146.689 24.4314 146.61 25.1372 145.882 25.5694C145.449 25.827 144.912 25.9836 144.337 25.9983C143.55 26.021 142.796 25.8122 142.275 25.4061L123.868 12.1278V24.2022C123.868 25.1655 122.717 25.9518 121.312 25.9518C119.895 25.9518 118.738 25.1757 118.738 24.2022V7.54853C118.738 6.58638 119.888 5.8001 121.294 5.8001ZM80.4739 7.50655C80.4739 8.52996 79.4661 9.36843 77.9163 9.36843H57.6308V13.0706H77.9163C79.3252 13.0706 80.4739 13.8569 80.4739 14.8202V24.2011C80.4739 25.1655 79.3252 25.9518 77.9163 25.9518H55.3433C53.9344 25.9518 52.7857 25.1655 52.7857 24.2011C52.7857 23.1777 53.7952 22.3392 55.3433 22.3392H75.5426V16.7422H55.3002C53.8913 16.7422 52.7426 15.9559 52.7426 14.9915V7.50655C52.7426 6.54213 53.8913 5.75585 55.3002 5.75585H77.9163C79.3252 5.75585 80.4739 6.54213 80.4739 7.50655ZM88.3972 5.75585H111.055C112.479 5.75585 113.614 6.53419 113.612 7.50881C113.609 9.06662 113.602 10.6142 113.592 12.1516C113.582 13.6913 113.576 15.24 113.573 16.8001C113.571 17.7634 112.422 18.5485 111.015 18.5485H90.7277V22.3392H111.013C112.422 22.3392 113.571 23.1255 113.571 24.0899C113.571 25.1133 112.561 25.9518 111.013 25.9518H88.3972C86.9882 25.9518 85.8395 25.1655 85.8395 24.2011V7.50655C85.8395 6.54213 86.9882 5.75585 88.3972 5.75585ZM90.7277 9.36843V14.9359H108.64V9.36843H90.7277ZM154.632 5.75585H171.873C172.708 5.75585 173.426 5.90675 174.117 6.22785L178.45 8.2429C179.354 8.66384 179.851 9.30602 179.851 10.0537V21.5836C179.851 22.3211 179.367 22.9553 178.485 23.3774L174.132 25.4594C173.431 25.7941 172.698 25.9518 171.843 25.9518H154.632C153.224 25.9518 152.075 25.1655 152.075 24.2011V7.50655C152.075 6.54213 153.224 5.75585 154.632 5.75585ZM156.965 9.36843V22.3392H171.457L174.875 20.7689V10.9376L171.457 9.36843H156.965ZM187.772 5.75585H210.43C211.854 5.75585 212.991 6.53419 212.988 7.50881C212.986 9.06662 212.979 10.6142 212.968 12.1516C212.958 13.6913 212.951 15.24 212.948 16.8001C212.946 17.7634 211.797 18.5485 210.39 18.5485H190.103V22.3392H210.389C211.797 22.3392 212.946 23.1255 212.946 24.0899C212.946 25.1133 211.937 25.9518 210.389 25.9518H187.772C186.364 25.9518 185.215 25.1655 185.215 24.2011V7.50655C185.215 6.54213 186.364 5.75585 187.772 5.75585ZM190.103 9.36843V14.9359H208.015V9.36843H190.103ZM220.913 5.78535H243.442C244.851 5.78535 246 6.57163 246 7.53604V20.5295C246 21.4939 244.851 22.2802 243.442 22.2802H238.428L239.264 23.0552C240.543 24.2431 239.744 25.8588 237.56 25.8588C236.572 25.8588 235.736 25.7374 234.891 24.8694L232.371 22.2802H223.2V24.3112C223.2 25.2143 222.123 25.9518 220.801 25.9518C219.452 25.9518 218.355 25.2438 218.355 24.3112V7.53604C218.355 6.57163 219.504 5.78535 220.913 5.78535ZM241.153 18.6971V9.36843H223.2V18.6971H241.153ZM44.4497 25.9495C42.6148 25.9495 41.0517 25.2779 41.0517 23.9061V2.082C41.0517 0.956469 42.3926 0.0385761 44.037 0.0385761C45.8354 0.0385761 47.3356 0.762452 47.3422 2.07519L47.435 23.9004C47.44 25.0385 46.1123 25.9495 44.4497 25.9495ZM29.2944 16.5516V4.60423H6.28058V16.5516H29.2944Z"
            fill="white"
          />
        </svg>
      </a>
    </div>
  );
};
