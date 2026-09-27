from tensorflow.keras.applications import VGG16

model = VGG16(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

print("VGG16 WORKING")
print("Output shape:", model.output_shape)