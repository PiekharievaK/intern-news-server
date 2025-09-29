export type BidRequest = {
	requestId: string;
	aid: string;
	sizes: string[]; // e.g. ["300x250"]
	placementId: string;
};

export type AuctionRequest = {
	bids: BidRequest[];
};
