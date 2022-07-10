/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compilers: {
        styledComponents: true, // fix lỗi load trang sẽ bị mất css do xung đột giữa styled component và nextjs
    },
};

module.exports = nextConfig;
