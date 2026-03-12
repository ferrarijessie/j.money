import * as React from "react";
import PropTypes from 'prop-types';

import { styled } from "styletron-react";
import { Block } from "baseui/block";
import { StyledDivider, SIZE as DividerSize } from "baseui/divider";
import { HeadingXXLarge, ParagraphSmall } from "baseui/typography";
import { ToasterContainer } from "baseui/toast";

import { Provider } from 'react-redux';
import store from '../../store';

import SignupModal from './SignupModal';
import LoginFormComponent from './LoginForm';

const HeadingContainer = styled(Block, {
    paddingTop: '10%',
    textAlign: 'center',
    width: '20%',
    justifySelf: 'center',
});

const TitleHeadingUI = styled(HeadingXXLarge, {
    marginBottom: '0px'
});

const SubtitleHeadingUI = styled(ParagraphSmall, {
    marginTop: '3px'
});

const LoginContainer = ({ setToken }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <Provider store={store}>
      <>
        <HeadingContainer>
          <TitleHeadingUI>jMoney</TitleHeadingUI>
          <SubtitleHeadingUI>Your personal finances manager</SubtitleHeadingUI>

          <StyledDivider $size={DividerSize.section} />
        </HeadingContainer>
        
        <ToasterContainer />

        <LoginFormComponent 
            setToken={setToken}
            setIsModalOpen={setIsModalOpen}
        />

        <SignupModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setToken={setToken}
        />
      </>
    </Provider>
  );
};

LoginContainer.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default LoginContainer;
