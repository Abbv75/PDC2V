import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/parallax';
import 'swiper/css/pagination';
import { EffectCoverflow, Autoplay, Navigation, Thumbs, Parallax, Pagination } from 'swiper/modules';

const CustomSwipper = (
    { photosListe }:
        { photosListe: string[] }
) => {
    return (
        <Swiper
            slidesPerView={1}
            navigation
            pagination
            modules={[EffectCoverflow, Autoplay, Navigation, Thumbs, Parallax, Pagination]}
            effect='coverflow'
            autoplay={{
                delay: 5000
            }}
            loop
            style={{
                width: "100%"
            }}
        >
            {
                photosListe.map(photo => (
                    <SwiperSlide
                        style={{
                            height: 200,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            style={{
                                objectFit: "contain",
                                height: "100%",
                                borderRadius: 12
                            }}
                            src={photo}
                        />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    )
}

export default CustomSwipper