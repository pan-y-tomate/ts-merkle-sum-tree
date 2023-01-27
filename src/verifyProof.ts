import { createMiddleNode } from './createNode';
import { HashFunction, MerkleProof, Node } from './types';

export default function verifyProof(proof: MerkleProof, hash: HashFunction): boolean {
  let sum = proof.balance;

  let node: Node = { hash: hash([proof.username, proof.balance]), sum };

  for (let i = 0; i < proof.siblingsHashes.length; i += 1) {
    const siblingNode = { hash: proof.siblingsHashes[i], sum: proof.siblingsSums[i] };

    if (proof.pathIndices[i] === 0) {
      node = createMiddleNode(node, siblingNode, hash);
    } else {
      node = createMiddleNode(siblingNode, node, hash);
    }

    sum += siblingNode.sum;
  }

  return proof.rootHash === node.hash && sum === node.sum;
}
