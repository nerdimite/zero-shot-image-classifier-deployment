import torch
import clip


class CLIPImageClassifier():
    '''Zero Shot Image Classifier based on CLIP'''

    def __init__(self, model_path):
        '''
        Args:
            model_path (str): Path to the model file in torchscript
        Returns:
            CLIPImageClassifier
        '''
        self.model, self.transformations = clip.load(
            model_path, device="cpu", jit=True)
        self.tokenizer = clip.tokenize

    def preprocess(self, image, classes):
        '''
        Preprocess the image and text classes
        Args:
            image (PIL.Image): The image which needs to be classified
            labels (list): List of classes in natural language
        Returns:
            Tuple[torch.Tensor, torch.Tensor]: Preprocessed image and text classes tensor
        '''
        image = self.transformations(image).unsqueeze(0)
        classes = self.tokenizer(classes)

        return image, classes

    def forward(self, image_input, classes_input):
        '''
        Performs a forward pass through the model
        Args:
            image_input (torch.Tensor): The preprocessed image tensor which is to be aligned to the labels
            labels_input (torch.Tensor): The preprocessed tensor of text labels which are aligned to the image
        Returns:
            list: Softmax normalized cosine distances of the image to the labels
        '''
        logits_per_image, logits_per_text = self.model(
            image_input, classes_input)
        probs = logits_per_image.softmax(dim=-1).squeeze().tolist()

        return probs

    def postprocess(self, probs, classes):
        '''
        Postprocess / format the raw outputs
        Args:
            probs (np.ndarray): Probabilities of the labels
            classes (List[str]): List of classes in natural language
        Returns:
            List[Tuple[str, float]]: List of tuples of class and probability that are sorted
        '''
        output = []
        for i, prob in enumerate(probs):
            output.append(
                (classes[i], round(prob, 4))
            )

        sorted_outputs = sorted(output, key=lambda x: x[1], reverse=True)
        return sorted_outputs

    def predict(self, image, classes):
        '''Returns the final predictions for the inputs'''

        image_input, classes_input = self.preprocess(image, classes)
        probs = self.forward(image_input, classes_input)
        output = self.postprocess(probs, classes)

        return output
