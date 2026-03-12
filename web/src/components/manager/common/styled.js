import { styled } from "styletron-react";
import { Block } from "baseui/block";
import { ParagraphSmall, LabelMedium } from "baseui/typography";


export const DetailsLabelTextUI = styled(LabelMedium, {
    fontWeight: '600',
});

export const DetailsTextUI = styled(ParagraphSmall, {
    marginTop: '5px',
    marginBottom: '0px',
});

export const TagsContainerUI = styled(Block, {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px'
});
