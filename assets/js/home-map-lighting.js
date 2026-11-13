import { DirectionalLight, NeutralToneMapping } from 'three';

export function configureBuildingLighting(viewer) {
  // Replace the frontal headlight with an oblique sun in the local east/up/south
  // frame. It stays fixed as visitors orbit, making adjacent facades distinct.
  viewer.pLight.intensity = 0;
  viewer.dirLight.intensity = 0;
  viewer.ambLight.intensity = 0.8;
  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(-3, 5, 2);
  const fill = new DirectionalLight(0xffffff, 0.35);
  fill.position.set(3, 2, -1);
  viewer.scene.add(key, key.target, fill, fill.target);
  // Compress bright faces without clipping away their orientation differences.
  viewer.renderer.toneMapping = NeutralToneMapping;
  viewer.renderer.toneMappingExposure = 1.1;
}
