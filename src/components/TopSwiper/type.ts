export interface TopSwiperProps {
    swipPictures: SwipPictures[];
    advertisementTextlls: string
}

interface SwipPictures {
    id: number;
    /** 轮播图 */
    val: string;
    name: string;
}