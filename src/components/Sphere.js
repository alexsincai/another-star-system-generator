const Sphere = ({ size, color }) => (
    <mesh castShadow={true} receiveShadow={true}>
        <sphereBufferGeometry args={[size, 32, 16]} attach="geometry" />
        <meshPhongMaterial color={color} attach="material" />
    </mesh>
);

export default Sphere;
