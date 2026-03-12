import React from "react";

import { styled } from "styletron-react";

import { Block } from "baseui/block";
import { ParagraphMedium, ParagraphSmall } from "baseui/typography";
import { StyledLink } from "baseui/link";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const ContainerUI = styled(Block, {
    textAlign: 'center',
    padding: '50px 0px',
    backgroundColor: '#eeeeee',
    marginTop: '20px'
});

const TitleUI = styled(ParagraphMedium, {
    fontWeight: '600'
});

const LinkUI = styled(StyledLink, {
    marginLeft: '5px'
})

const EmptySummary = () => {

    return (
        <ContainerUI>
            <ParagraphMedium>
                <FontAwesomeIcon icon={faEyeSlash} size="2xl" />
            </ParagraphMedium>
            <TitleUI>You have no data to show yet</TitleUI>
            <ParagraphSmall>
                Get started by creating your own finances list on the 
                <LinkUI href="/manager">
                    manager section
                </LinkUI>
            </ParagraphSmall>
        </ContainerUI>
    );
};

export default EmptySummary;