import { registerEnumType } from '@nestjs/graphql';

export enum NofificationTypeEnum {
    BIDDING_REQUESTED = 'BIDDING_REQUESTED',
    BIDDING_CANCELED = 'BIDDING_CANCELED',
    ORDER_COMPLETED_BUYER = 'ORDER_COMPLETED_BUYER',
    ORDER_COMPLETED_SELLER = 'ORDER_COMPLETED_SELLER',
    ORDER_CANCELED_BUYER = 'ORDER_CANCELED_BUYER',
    ORDER_CANCELED_SELLER = 'ORDER_CANCELED_SELLER',
    REFUND_EXCHANGE_APPROVED = 'REFUND_EXCHANGE_APPROVED',
    REFUND_EXCHANGE_REJECTED = 'REFUND_EXCHANGE_REJECTED',
    SELLING_APPROVED = 'SELLING_APPROVED',
    SELLING_REJECTED = 'SELLING_REJECTED',
    SELLING_COMPLETED = 'SELLING_COMPLETED',
    ONDA_BUY_APPROVED = 'ONDA_BUY_APPROVED',
    ONDA_BUY_REJECTED = 'ONDA_BUY_REJECTED',
    ONDA_BUY_COMPLETED = 'ONDA_BUY_COMPLETED',
    ONDA_CONCIERGE_APPROVED = 'ONDA_CONCIERGE_APPROVED',
    ONDA_CONCIERGE_REJECTED = 'ONDA_CONCIERGE_REJECTED',
    ONDA_CONCIERGE_COMPLETED = 'ONDA_CONCIERGE_COMPLETED',
    ONDA_CONCIERGE_SELLING = 'ONDA_CONCIERGE_SELLING',
    ONDA_CONCIERGE_SELLING_COMPLETED = 'ONDA_CONCIERGE_SELLING_COMPLETED',
    QUESTION_ANSWERED = 'QUESTION_ANSWERED',
    NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE',
    NEW_CHAT_INVITED = 'NEW_CHAT_INVITED',
    ONDA_INFORM = 'ONDA_INFORM',
    COMMENT_REPLY_HIDDEN = 'COMMENT_REPLY_HIDDEN',
    BLOG_POST_HIDDEN = 'BLOG_POST_HIDDEN',
    COMMENT_REPLY_REDISPLAY = 'COMMENT_REPLY_REDISPLAY',
    BLOG_POST_REDISPLAY = 'BLOG_POST_REDISPLAY',
    PRODUCT_DEACTIVATED = 'PRODUCT_DEACTIVATED',
    PRODUCT_REACTIVATED = 'PRODUCT_REACTIVATED',
}

registerEnumType(NofificationTypeEnum, {
    name: 'NofificationTypeEnum',
});

export const notificationKorean = {
    BIDDING_REQUESTED: {
        koreanType: '흥정요청',
        notiContent: '흥정이 요청되었습니다.',
        pushContent: '흥정이 요청되었습니다.',
    },
    BIDDING_CANCELED: {
        koreanType: '흥정취소',
        notiContent: '수락하신 흥정이 취소되었습니다.',
        pushContent: '수락하신 흥정이 취소되었습니다.',
    },
    ORDER_COMPLETED_BUYER: {
        koreanType: '구매확정',
        notiContent: '구매하신 주문건이 확정되었습니다. 주문금액이 판매자에 정산됩니다.',
        pushContent: '구매하신 주문건이 확정되었습니다. 주문금액이 판매자에 정산됩니다.',
    },
    ORDER_COMPLETED_SELLER: {
        koreanType: '판매완료',
        notiContent: '판매건이 완료되었습니다. 금액이 정산됩니다.',
        pushContent: '판매건이 완료되었습니다. 금액이 정산됩니다.',
    },
    ORDER_CANCELED_BUYER: {
        koreanType: '주문취소',
        notiContent: '주문이 취소되었습니다.',
        pushContent: '주문이 취소되었습니다.',
    },
    ORDER_CANCELED_SELLER: {
        koreanType: '주문취소',
        notiContent: '판매상품의 주문이 취소되었습니다.',
        pushContent: '판매상품의 주문이 취소되었습니다.',
    },
    REFUND_EXCHANGE_APPROVED: {
        koreanType: '반품/교환 승인',
        notiContent: '반품/교환요청이 승인되었습니다.',
        pushContent: '반품/교환요청이 승인되었습니다.',
    },
    REFUND_EXCHANGE_REJECTED: {
        koreanType: '반품/교환 불가',
        notiContent: '반품/교환 불가',
        pushContent: '반품/교환이 불가합니다. 주문이 완료처리됩니다.',
    },
    SELLING_APPROVED: {
        koreanType: '상품판매게시',
        notiContent: '상품이 온다에서 판매됩니다.',
        pushContent: '상품이 온다에서 판매됩니다. ',
    },
    SELLING_REJECTED: {
        koreanType: '상품판매불가',
        notiContent: '신청하신 상품이 판매불가입니다. 궁금사항 있으시면 어드민에 문의하세요.',
        pushContent: '신청하신 상품이 판매불가입니다. 궁금사항 있으시면 어드민에 문의하세요.',
    },
    SELLING_COMPLETED: {
        koreanType: '판매완료',
        notiContent: '판매완료되어 금액 정산이 되었습니다.',
        pushContent: '판매완료되어 금액 정산이 되었습니다.',
    },
    ONDA_BUY_APPROVED: {
        koreanType: '매입요청 승인완료',
        notiContent: '매입요청이 승인되었습니다.',
        pushContent: '매입요청이 승인되었습니다.',
    },
    ONDA_BUY_REJECTED: {
        koreanType: '매입 접수불가',
        notiContent: '매입요청이 접수불가입니다.',
        pushContent: '매입요청이 접수불가입니다.',
    },
    ONDA_BUY_COMPLETED: {
        koreanType: '매입완료',
        notiContent: '매입금액 정산 완료로 매입이 완료되었습니다.',
        pushContent: '매입금액 정산 완료로 매입 건 완료되었습니다.',
    },
    ONDA_CONCIERGE_APPROVED: {
        koreanType: '위탁판매요청 승인완료',
        notiContent: '위탁판매요청이 승인되었습니다.',
        pushContent: '위탁판매요청이 승인되었습니다.',
    },
    ONDA_CONCIERGE_REJECTED: {
        koreanType: '위탁판매 접수불가',
        notiContent: '매입요청이 접수불가입니다.',
        pushContent: '매입요청이 접수불가입니다.',
    },
    ONDA_CONCIERGE_COMPLETED: {
        koreanType: '위탁판매완료',
        notiContent: '위탁판매금액 정산 완료로 위탁판매가 완료되었습니다.',
        pushContent: '위탁판매금액 정산 완료로 위탁판매가 완료되었습니다.',
    },
    ONDA_CONCIERGE_SELLING: {
        koreanType: '온다판매진행중',
        notiContent: '위탁하신 상품이 ONDA에서 판매됩니다.',
        pushContent: '위탁하신 상품이 ONDA에서 판매됩니다.',
    },
    ONDA_CONCIERGE_SELLING_COMPLETED: {
        koreanType: '온다판매완료',
        notiContent: '위탁하신 상품이 ONDA에서 판매완료되었습니다.',
        pushContent: '위탁하신 상품이 ONDA에서 판매완료되었습니다.',
    },
    QUESTION_ANSWERED: {
        koreanType: '1:1답변',
        notiContent: '답변이 등록되었습니다.',
        pushContent: '답변이 등록되었습니다.',
    },
    NEW_CHAT_MESSAGE: {
        koreanType: '새 문자',
        notiContent: '님이 새로운 문자를 보냈습니다.',
        pushContent: '님이 새로운 문자를 보냈습니다.',
    },
    NEW_CHAT_INVITED: {
        koreanType: '그룹채팅 초대',
        notiContent: '그룹채팅에 초대되었습니다.',
        pushContent: '그룹채팅에 초대되었습니다.',
    },
    ONDA_INFORM: {
        koreanType: '',
        notiContent: '',
        pushContent: '',
    },
    COMMENT_REPLY_HIDDEN: {
        koreanType: '댓글/답글 미노출',
        notiContent: `본인의 댓글/답글 '[Comment content]' 신고되어 미노출 처리됩니다.`,
        pushContent: `본인의 댓글/답글 '[Comment content]' 신고되어 미노출 처리됩니다.`,
    },
    BLOG_POST_HIDDEN: {
        koreanType: '게시글 재노출',
        notiContent: `본인의 게시글 '[Blog post name]' 신고되어 미노출 처리됩니다.`,
        pushContent: `본인의 게시글 '[Blog post name]' 신고되어 미노출 처리됩니다.`,
    },
    COMMENT_REPLY_REDISPLAY: {
        koreanType: '댓글/답글 노출',
        notiContent: `본인의 댓글/답글 '[Comment content]' 다시 노출 처리됩니다.`,
        pushContent: `본인의 댓글/답글 '[Comment content]' 다시 노출 처리됩니다.`,
    },
    BLOG_POST_REDISPLAY: {
        koreanType: '게시글 재노출',
        notiContent: `본인의  게시글 '[Blog post name]' 다시 노출 처리됩니다.`,
        pushContent: `본인의  게시글 '[Blog post name]' 다시 노출 처리됩니다.`,
    },
    PRODUCT_DEACTIVATED: {
        koreanType: '상품 비활성',
        notiContent: `본인의 판매상품 [Product name] 신고되어 비활성화 처리됩니다.`,
        pushContent: `본인의 판매상품 [Product name]이 신고되어 비활성화 처리됩니다.`,
    },
    PRODUCT_REACTIVATED: {
        koreanType: '상품 재활성',
        notiContent: `본인의 판매상품 [Product name] 다시 활성화됩니다.`,
        pushContent: `본인의 판매상품 [Product name] 다시 활성화됩니다.`,
    },
};
