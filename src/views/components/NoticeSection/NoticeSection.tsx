import React from 'react';
import css from './NoticeSection.module.scss';
import ArrowDownIcon from "@svgs/ArrowDownIcon/ArrowDownIcon";

interface NoticeSectionProps {}

const NoticeSection: React.FC<NoticeSectionProps> = () => {
  return (
    <div className={css.NoticeSection}>
      <div className={css.titleContainer}>
        <div className={css.title}>
          <h2>NOTICE</h2>
          <h4>FEConf 2020의 소식을 전해드립니다</h4>
        </div>
        <div className={css.circle}/>
        <div className={css.dashedCircle}/>
      </div>
      <div className={css.socialPlatformContainer}>
        {[...Array(3).keys()].map((i) =>
          <div key={i} className={css.platform}>
            <div className={css.icon}/>
            <h3>프론트엔드개발그룹</h3>
            <div className={css.mobileTitleWrap}>
              <div className={css.icon}/>
              <h3>프론트엔드개발그룹</h3>
            </div>
            <p>
              프론트엔드개발그룹의 공식 페이스북 그룹
              입니다. 최신 공지사항을 확인할 수 있습니다.
            </p>
            <a href=""> <ArrowDownIcon/> </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeSection;
