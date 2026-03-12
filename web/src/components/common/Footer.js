import React from "react";

import { Block } from "baseui/block";
import { styled } from "styletron-react";
import { DarkTheme, ThemeProvider } from "baseui";
import { ParagraphXSmall } from "baseui/typography";
import { StyledLink } from "baseui/link";


const FooterContainerUI = styled(Block, {
    backgroundColor: '#000000',
    width: '100%',
    height: '50px',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    padding: '0px 20px',
    textAlign: 'center',
    zIndex: 1000,
});

const FooterLinkUI = styled(StyledLink, {
  marginLeft: '3px',
  marginRight: '3px',
});

function Footer() {
  return (
    <ThemeProvider theme={DarkTheme}>
        <FooterContainerUI>
          <ParagraphXSmall>
            Developed and Designed by Jessica Ferrari | 
            <FooterLinkUI href="https://github.com/ferrarijessie" target="_blank">
              github.com/ferrarijessie
            </FooterLinkUI>
            |
            <FooterLinkUI href="https://www.linkedin.com/in/jessica-ferrari-09ab7163/" target="_blank">
              LinkedIn
            </FooterLinkUI>
          </ParagraphXSmall>
        </FooterContainerUI>
    </ThemeProvider>
  );
}

export default Footer;
