import React from "react";

import { styled } from "styletron-react";

import { Block } from "baseui/block";
import { ParagraphMedium, ParagraphSmall } from "baseui/typography";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const ContainerUI = styled(Block, {
    textAlign: 'center',
    padding: '50px 0px',
});

const TitleUI = styled(ParagraphMedium, {
    fontWeight: '600'
});

const BlankState = () => {

    return (
        <ContainerUI>
            <ParagraphMedium>
                <FontAwesomeIcon icon={faEyeSlash} height={"50px"} />
            </ParagraphMedium>
            <TitleUI>No Results to Show Yet</TitleUI>
            <ParagraphSmall>Click the "New" button on the top to get started!</ParagraphSmall>
        </ContainerUI>
    );
};

export default BlankState;