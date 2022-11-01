const Star = ({ color }) => (
    <>
        <mesh>
            <sphereBufferGeometry args={[1, 32, 16]} attach="geometry" />
            <meshStandardMaterial emissive={color} attach="material" />
        </mesh>
        <pointLight color={color} intensity="1.8" castShadow={true} />
    </>
);

export default Star;
