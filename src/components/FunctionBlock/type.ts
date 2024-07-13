import React, { ReactNode } from "react";

export enum JumpTypeEnum {
  modal = "modal",
  router = "router",
}

interface ModalBlockContent {
  name: string;
  jumpType: JumpTypeEnum.modal;
  modalContent: ReactNode | string;
  icon?: ReactNode;
}

interface HistoryBlockContent {
  name: string;
  jumpType: JumpTypeEnum.router;
  path: string;
  icon?: ReactNode;
}

export type BlockContent = ModalBlockContent | HistoryBlockContent;

export interface FunctionBlockProps {
  blockContent: BlockContent[];
  style?: React.CSSProperties;
}
