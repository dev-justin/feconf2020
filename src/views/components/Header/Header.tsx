import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {motion} from "framer-motion";
import {useDispatch} from "react-redux";
import classcat from "classcat";
import css from './Header.module.scss';
import HeaderLogo from "@svgs/HeaderLogo/HeaderLogo";
import {useAppState} from "@store/index";
import {setMenuState} from "@store/slices/appSlice";
import dynamic from "next/dynamic";
import RegisterSupportButton from "@components/RegisterSupportButton/RegisterSupportButton";
import headerMotions from "@motions/header.motion";
import { useWindowScroll } from '@utils/hooks/use-window';

const MenuModal = dynamic(() => import("@components/MenuModal/MenuModal"));

interface HeaderProps {
  hasSessions?: boolean;
}

const useAnimatedHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const latestScrollYRef = useRef<number>();

  useWindowScroll(({ scroll }) => {
    const offset = 12;
    const isHeroPosition = scroll <= 100;
    const isSwipeUp = !isVisible && (latestScrollYRef.current - offset) > scroll;
    const isSwipeDown = isVisible && latestScrollYRef.current < (scroll - offset);
    if (isHeroPosition || isSwipeUp) {
      setIsVisible(true);
    } else if (isSwipeDown) {
      setIsVisible(false);
    }
    latestScrollYRef.current = scroll;
  }, [isVisible]);
  return { isVisible };
}

const useChangedMenuState = (menuOpen: boolean) => {
  const firstRender = useRef(true);
  return useMemo(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return false;
    }
    return true;
  }, [menuOpen]);
}

const Header: React.FC<HeaderProps> = ({ hasSessions = true }) => {
  const dispatch = useDispatch();
  const [menuInitialized, initMenu] = useState(false);
  const { menuOpen } = useAppState();
  const { isVisible } = useAnimatedHeader();
  const hasMenuStateChanged = useChangedMenuState(menuOpen);
  const onNavigateTo = useCallback((evt, target: string) => {
    evt.preventDefault();
    const element = document.getElementById(target);
    const { top } = element?.getBoundingClientRect();
    const offset = pageYOffset - 100;
    scrollTo(0, Math.max(offset + top, 0));
  }, []);
  useEffect(() => {
    setTimeout(() => initMenu(true));
  }, []);
  return (
    <motion.div
      className={classcat([css.Header, isVisible && css.isVisible])}
      animate={{ y: isVisible || menuOpen ? '0%' : '-100%' }}
    >
      <a className={css.logo} href="/">
        <HeaderLogo/>
      </a>
      <div className={css.menu}>
        <a href="#" onClick={(evt) => onNavigateTo(evt, 'about')}>About</a>
        <a href="#" onClick={(evt) => onNavigateTo(evt, 'speakers')}>Speakers</a>
        { hasSessions ?
          <a href="#" onClick={(evt) => onNavigateTo(evt, 'sessions')}>Sessions</a> :
          <a href="#" onClick={(evt) => onNavigateTo(evt, 'sponsors')}>Sponsors</a>
        }
        { hasSessions ?
          <a href="#" onClick={(evt) => onNavigateTo(evt, 'sponsors')}>Sponsors</a> :
          <a href="#" onClick={(evt) => onNavigateTo(evt, 'notice')}>Notice</a>
        }
        <RegisterSupportButton/>
      </div>
      <motion.div
        className={css.menuBtn}
        animate={hasMenuStateChanged ? (menuOpen ? 'open' : 'close') : ''}
        onClick={() => dispatch(setMenuState(!menuOpen))}
      >
        <motion.div
          className={css.bar}
          variants={headerMotions.barLeft}
        />
        <motion.div
          className={css.bar}
          variants={headerMotions.barRight}
        />
      </motion.div>
      { menuInitialized ? (
        <MenuModal
          active={menuOpen}
          hasSessions={hasSessions}
          onNavigateTo={onNavigateTo}
        />) : null }
    </motion.div>
  );
}

export default Header;
