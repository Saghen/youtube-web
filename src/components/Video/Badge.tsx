import { colors } from "@constants";
import { styled } from "solid-styled-components";

export const LiveNow = styled('span')`
  color: ${colors.red};
  border: 1px solid ${colors.red};
  border-radius: 2px;
  padding: 3px 4px;

  /* FIXME: Should be unnecessary */
  align-self: flex-start;
`
